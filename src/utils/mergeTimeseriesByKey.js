import moment from 'moment'

const mergeTimeseriesByKey = ({ timeseries, key: mergeKey }) => {
  const longestTSMut = timeseries.reduce((acc, val) => {
    return acc.length > val.length ? acc : val
  }, [])

  const longestTS = longestTSMut.slice()
  const longestTSLastIndex = longestTS.length - 1

  for (const timeserie of timeseries) {
    if (timeserie === longestTSMut) {
      continue
    }

    let longestTSRightIndexBoundary = longestTSLastIndex
    let timeserieRightIndex = timeserie.length - 1

    if (timeserieRightIndex < 0) {
      continue
    }

    if (mergeKey === 'datetime') {
      for (
        ;
        moment(longestTS[longestTSRightIndexBoundary]['datetime']).isBefore(
          moment(timeserie[timeserieRightIndex]['datetime'])
        );
        timeserieRightIndex--
      ) {
        longestTS.push(timeserie[timeserieRightIndex])
      }
    }

    for (; timeserieRightIndex > -1; timeserieRightIndex--) {
      for (; longestTSRightIndexBoundary > -1; longestTSRightIndexBoundary--) {
        const longestTSData = longestTS[longestTSRightIndexBoundary]
        const timeserieData = timeserie[timeserieRightIndex]
        if (longestTSData[mergeKey] === timeserieData[mergeKey]) {
          longestTS[longestTSRightIndexBoundary] = Object.assign(
            {},
            longestTSData,
            timeserieData
          )
          break
        }
      }
      if (longestTSRightIndexBoundary === -1) {
        break
      }
    }
  }

  return longestTS
}

export default mergeTimeseriesByKey
