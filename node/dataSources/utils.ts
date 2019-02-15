import { adjust, curry, forEach, forEachObjIndexed, fromPairs, has, includes, isEmpty, isNil, join, map, pipe, reject, replace, toPairs } from 'ramda'


interface Params {
  [param: string]: string
}

interface LabelValue {
  label: string,
  value: number
}

interface DataPerStatusCode {
  [httpStatus: string]: LabelValue[]
}

interface DataNewFormat {
  name: string,
  data: LabelValue[]
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
  return map((chartPoint: any) => {
    forEachObjIndexed(curry(calculateMeanForObject)(metrics, metricName), chartPoint)
    return chartPoint
  }, chartData)
}

// function to calculate mean of metrics in the custom format such as
// routeStats
const calculateMeanForArrayOfCustom = (chartData: any[]) => {
  return map((chartPoint: any) => {
    let mean = chartPoint['summary.sum']
    if (chartPoint.count) {
      mean /= chartPoint.count
    }
    return {
      ...chartPoint,
      mean,
    }
  }, chartData)
}

export const addMeanProperty = (data: object[], metricName: string) => {
  if (metricName === 'memoryUsage') {
    const memoryMetrics = ['summary.external', 'summary.heapUsed', 'summary.heapTotal', 'summary.rss']
    calculateMeanForArray(data, memoryMetrics, metricName)
  } else if (metricName === 'cpuUsage') {
    const cpuMetrics = ['summary.system', 'summary.user']
    calculateMeanForArray(data, cpuMetrics, metricName)
  }
  // else {
  //   calculateMeanForArrayOfCustom(data)
  // }
}

const updateDataPerStatusCode = (dataPerStatusCode: DataPerStatusCode, data: any): void => {
  const httpStatus: string = data['key.httpStatus']
  if (!has(httpStatus, dataPerStatusCode)) {
    dataPerStatusCode[httpStatus] = []
  }
  dataPerStatusCode[httpStatus].push({ label: data.date, value: data['summary.count'] })
}

const addDataInNewFormat = (dataNewFormat: DataNewFormat[], value: LabelValue[], key: string): void => {
  dataNewFormat.push({ name: key, data: value })
}

const createHttpStatusTimeSeriesFormat = (data: object[]): DataNewFormat[] => {
  const dataPerStatusCode: DataPerStatusCode = {}
  forEach(
    curry(updateDataPerStatusCode)(dataPerStatusCode)
    , data
  )

  const dataNewFormat: DataNewFormat[] = []
  forEachObjIndexed(
    curry(addDataInNewFormat)(dataNewFormat)
    , dataPerStatusCode
  )

  return dataNewFormat
}

const isHttpStatusTimeSeries = (params: Params) => {
  return has('interval', params) && // is a timeseries
         has('aggregateBy', params) && includes('data.key.httpStatus', params.aggregateBy) // is about http status code
}

export const transformDataFormat = (data: object[], params: Params): object[] => {
  if (isHttpStatusTimeSeries(params)) {
    return createHttpStatusTimeSeriesFormat(data)
  }
  return data
}
