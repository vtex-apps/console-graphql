import {
  adjust,
  curry,
  filter,
  forEach,
  forEachObjIndexed,
  fromPairs,
  groupBy,
  has,
  includes,
  isEmpty,
  isNil,
  join,
  keys,
  map,
  pipe,
  reject,
  replace,
  startsWith,
  toPairs,
} from 'ramda'

import { Fraction, UType } from './typings'

interface Params {
  [param: string]: string
}

interface Total {
  [date: string]: number
}

export const getTransformedParams = (params: StoreDashInput): Params => {
  const {
    appName = '',
    appVersion = '',
    region = '',
    production = '',
    metricName = '',
    aggregateBy = [],
    fields = [],
    ...otherParams
  } = params || {}

  return reject(isNilOrEmpty, {
    aggregateBy: join(',', aggregateBy),
    'data.key.name': metricName,
    'data.processEnv.appName': appName,
    'data.processEnv.appVersion': appVersion,
    'data.processEnv.production': production,
    'data.processEnv.region': region,
    fields: join(',', fields),
    ...otherParams,
  })
}

const isNilOrEmpty = x => isEmpty(x) || isNil(x)

const renameBy = (fn, obj) => (
  pipe(
    toPairs,
    map(adjust(0 as any, fn)),
    fromPairs
  )(obj)
)

export const renameProperties = (pattern: string, data: any) => {
  const regex = new RegExp('^' + pattern)
  return map(obj => renameBy(replace(regex, ''), obj), data)
}

const calculateMeanForObject = (metrics: string[], metricName: string, value: any, key: string | number | symbol, obj: any) => {
  if (includes(key, metrics) && obj.count) {
    if (metricName === 'cpuUsage') {
      obj[key] = obj[key] / obj.count
    } else {
      obj[key] = Math.round(obj[key] / obj.count)
    }
  }
}

// function to calculate mean of metrics different than custom format such
// as memoryUsage and cpuUsage
const calculateMeanForArray = (chartData: any[], metrics: string[], metricName: string) => {
  forEach((chartPoint: any) => {
    forEachObjIndexed(curry(calculateMeanForObject)(metrics, metricName), chartPoint)
  }, chartData)
}

// function to calculate mean of metrics in the custom format such as
// routeStats
const calculateMeanForArrayOfCustom = (chartData: any[]): void => {
  forEach((chartPoint: any) => {
    const sum: number = chartPoint['summary.sum']
    const count: number = chartPoint['summary.count']
    const mean = count ? (sum / count) : sum
    chartPoint['summary.mean'] = mean
  }, chartData)
}

export const addMeanProperty = (data: any[], metricName: string) => {
  if (metricName === 'memoryUsage') {
    const memoryMetrics = ['summary.external', 'summary.heapUsed', 'summary.heapTotal', 'summary.rss']
    calculateMeanForArray(data, memoryMetrics, metricName)
  } else if (metricName === 'cpuUsage') {
    const cpuMetrics = ['summary.system', 'summary.user']
    calculateMeanForArray(data, cpuMetrics, metricName)
  } else if (has('summary.sum', data[0])) {
    calculateMeanForArrayOfCustom(data)
  }
}

const changeToRelativeForStatusCodeLineChart = (data: any[]): any[] => {
  const total: Total = {}
  forEach(
    (dataPoint: any) => {
      const date: string = dataPoint.date
      if (!has(date, total)) {
        total[date] = 0
      }
      total[date] += dataPoint['summary.count']
    }
    , data
  )
  forEach(
    (dataPoint: any) => {
      dataPoint['summary.ratio'] = dataPoint['summary.count'] / total[dataPoint.date]
    }
    , data
  )
  return data
}

const changeToRelativeForStatusCodeBarChart = (data: object[]): any[] => {
  let total: number = 0
  forEach(
    (dataPoint: any) => {
      total += dataPoint['summary.count']
    }
    , data
  )
  forEach(
    (dataPoint: any) => {
      dataPoint['summary.ratio'] = dataPoint['summary.count'] / total
    }
    , data)
  return data
}

export const changeToRelative = (data: object[], transformationType: string): any[] => {
  switch (transformationType) {
    case 'StatusCodeBarChart':
      return changeToRelativeForStatusCodeBarChart(data)
    case 'StatusCodeLineChart':
      return changeToRelativeForStatusCodeLineChart(data)
    default:
      return data
  }
}

const transformToSimpleDateFormat = (data: any[]): UType => {
  return map(
    (element: any) => {
      const fraction: Fraction = {}
      fraction.id = element.date
      fraction.slices = []

      const desiredKeys = filter(
        (key: string) => {
          return startsWith('summary', key)
        }
        , keys(element))

      forEach(
        (key: string) => {
          fraction.slices.push(
            {
              content: [
                {
                  key: replace('summary.', '', key),
                  value: element[key],
                },
              ],
              sliceId: [],
            }
          )
        }
        , desiredKeys)
      return fraction
    }
    , data)
}

const transformToRouteStatsBarChartFormat = (data: any[]): UType => {
  return map(
    ({ 'key.httpStatus': httpStatus, 'summary.ratio': ratio }: any) => {
      const fraction: Fraction = {}
      fraction.id = httpStatus
      fraction.slices = [
        {
          content: [
            {
              key: 'ratio',
              value: ratio,
            },
          ],
          sliceId: [],
        },
      ]
      return fraction
    }
    , data)
}

const transformToAggregatedLineChartFormat = (data: any[], key: string): UType => {
  const aggregateByDate = groupBy(
    (element: any) => {
      return element.date
    }
    , data)

  const fractions: UType = []

  forEachObjIndexed(
    (elementsFromDate: any[], date: string) => {
      fractions.push(
        {
          id: date,
          slices: [],
        }
      )
      const lastIndex = fractions.length - 1
      forEach(
        (slice: any) => {
          fractions[lastIndex].slices.push(
            {
              content: [
                {
                  key,
                  value: slice[`summary.${key}`],
                },
              ],
              sliceId: [
                {
                  key: 'httpStatus',
                  value: slice['key.httpStatus'],
                },
              ],
            }
          )
        }
        , elementsFromDate)
    }
    , aggregateByDate)

  return fractions
}

export const transformDataFormat = (data: object[], transformationType: string): UType => {
  switch (transformationType) {
    case 'CpuUsageLineChart':
    case 'MemoryUsageLineChart':
      return transformToSimpleDateFormat(data)
    case 'StatusCodeBarChart':
      return transformToRouteStatsBarChartFormat(data)
    case 'StatusCodeLineChart':
      return transformToAggregatedLineChartFormat(data, 'ratio')
    case 'LatencyLineChart':
      return transformToAggregatedLineChartFormat(data, 'mean')
    default:
      return data
  }
}
