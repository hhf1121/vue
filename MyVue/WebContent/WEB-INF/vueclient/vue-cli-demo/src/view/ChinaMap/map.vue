<template>
      <ve-map :extend="chartExtend" height="700px" width="100%" :events="chartEvents" style="text-align: center"></ve-map>
</template>

<script>
import provinceCoordinate from './../../database/provinceCoordinate';
let _this = {};

let symbolSize = 500000;
const legendData = ['全部', 'A网、派送', 'A网、自提', 'B网、派送', 'B网、自提'];

function convertData(data) {
  if (data) {
    let res = [];
    for (let i = 0; i < data.length; i++) {
      const records = provinceCoordinate.records;
      for (let j = 0; j < records.length; j++) {
        if (data[i].name === records[j].shortName) {
          let values = [];
          values.push(parseFloat(records[j].lng));
          values.push(parseFloat(records[j].lat));
          res.push({
            name: data[i].name,
            value: values.concat(data[i].value),
            lastWeekCount: data[i].lastWeekCount,
          });
          break;
        }
      }
    }
    return res;
  }
}

function toThousands(num) {
  let result = '', counter = 0;
  num = (num || 0).toString();
  for (let i = num.length - 1; i >= 0; i--) {
    counter++;
    result = num.charAt(i) + result;
    if (!(counter % 3) && i != 0) {
      result = ',' + result;
    }
  }
  return result;
}

export default {
  name: 'ChinaMap',
  props: {
    argsData: {
      type: Array,
    },
    selectedStatus: {
      type: Object
    }
  },
  watch: {
    selectedStatus(val) {
      this.chartExtend.legend.selected = val;
    },
    argsData(val) {
      if (8 === this.chartExtend.series.length) {
        this.chartExtend.series.splice(3, 7);
      }
      if (0 < this.chartExtend.yAxis.data.length) {
        this.chartExtend.yAxis.data.splice(0, this.chartExtend.yAxis.data.length);
      }
      let data = [];
      for (let i = 0; i < val.length; i++) {
        data.push({name: val[i].province, value: val[i].count, lastWeekCount: val[i].lastWeekCount});
      }
      this.chartExtend.series[0].data = convertData(data);
      this.chartExtend.series[1].data = data;
      this.chartExtend.series[2].data = convertData(data.sort(function (a, b) {
        return b.value - a.value;
      }).slice(0, 10));
      data.sort(function (a, b) {
        return a.value - b.value;
      });
      for (let i = 0; i < data.length; i++) {
        this.chartExtend.yAxis.data.push(data[i].name);
        if (i == (data.length - 1)) {
          this.chartExtend.visualMap.max = data[i].value / 5;
        }
      }
      for (let i = 0; i < legendData.length; i++) {
        this.chartExtend.series.push({
          name: legendData[i], z: 2, type: 'bar', color: '#3598c1', data: data, barCategoryGap: '30%',
          itemStyle: {
            emphasis: {color: '#b7d6f3'}
          }
        });
      }
    }
  },
  data() {
    this.chartEvents = {
      legendselectchanged: function (e) {
        let deptAttribute = 0, otherAttribute = 0;
        if (e.name === 'A网、派送') {
          deptAttribute = 1;
          otherAttribute = 2;
        } else if (e.name === 'A网、自提') {
          deptAttribute = 1;
          otherAttribute = 1;
        } else if (e.name === 'B网、派送') {
          deptAttribute = 2;
          otherAttribute = 2;
        } else if (e.name === 'B网、自提') {
          deptAttribute = 2;
          otherAttribute = 1;
        }
        _this.$emit('legendSelectChanged', deptAttribute, otherAttribute, e.selected);
      }
    };
    return {
      chartExtend: {
        tooltip: {
          padding: 0,
          enterable: true,
          transitionDuration: 1,
          textStyle: {
            color: '#000',
            decoration: 'none',
          },
          formatter: function (params) {
            let tipHtml = '<div style="color:#FFF;">' + params.name;
            if (params.seriesType === 'map') {
              tipHtml += '</br>' + params.marker + '数量：' + toThousands(params.value);
            } else if (params.seriesType === 'effectScatter' || params.seriesType === 'scatter') {
              tipHtml += '</br>' + params.marker + '数量：' + toThousands(params.value[2]);
            } else if (params.seriesType === 'bar') {
              console.log(params);
              tipHtml += '，' + params.seriesName + '</br>';
              const value = params.data.value - params.data.lastWeekCount;
              if (value < 0) {
                const value = params.data.lastWeekCount - params.data.value;
                tipHtml += '周涨幅：下降 ' + ((parseFloat(value) / parseFloat(params.data.lastWeekCount)).toFixed(2)) + '%';
              } else {
                tipHtml += '周涨幅：上涨 ' + ((parseFloat(value) / parseFloat(params.data.lastWeekCount)).toFixed(2)) + '%';
              }
              tipHtml += '</br> 数量：' + toThousands(params.value);
            }
            tipHtml += '</div>';
            return tipHtml;
          }
        },
        visualMap: {
          show: false,
          min: 0,
          max: 0,
          left: '10%',
          top: 'bottom',
          calculable: true,
          seriesIndex: [1],
          inRange: {
            color: ['#edfbfb', '#b7d6f3', '#40a9ed', '#3598c1', '#215096',]
          },
        },
        geo: {
          show: true,
          map: 'china',
          label: {
            normal: {
              show: false
            },
            emphasis: {
              show: false,
            }
          },
          roam: false,
          itemStyle: {
            normal: {
              areaColor: '#023677',
              borderColor: '#1180c7',
            },
            emphasis: {
              areaColor: '#4499d0',
            }
          },
          left: '10%',
          layoutCenter: ['30%', '60%'],
          // 如果宽高比大于 1 则宽度为 100，如果小于 1 则高度为 100，保证了不超过 100x100 的区域
          layoutSize: 700,
        },
        series: [
          {
            name: '散点', type: 'scatter', coordinateSystem: 'geo', data: [], symbolSize: function (val) {
              return val[2] / symbolSize;
            },
            label: {
              normal: {formatter: '{b}', position: 'right', show: true},
              emphasis: {show: true}
            },
            itemStyle: {
              normal: {
                color: '#fff'
              }
            }
          },
          {
            type: 'map',
            map: 'china',
            geoIndex: 0,
            aspectScale: 0.75, //长宽比
            showLegendSymbol: false, // 存在legend时显示
            label: {
              normal: {
                show: true
              },
              emphasis: {
                show: false,
                textStyle: {
                  color: '#fff'
                }
              }
            },
            roam: true,
            itemStyle: {
              normal: {
                areaColor: '#031525',
                borderColor: '#3B5077',
              },
              emphasis: {
                areaColor: '#2B91B7'
              }
            },
            animation: false,
            data: []
          },
          {
            name: 'Top 10',
            type: 'effectScatter',
            coordinateSystem: 'geo',
            data: [],
            hoverAnimation: true,
            showEffectOn: 'render',
            zlevel: 1,
            symbolSize: function (val) {
              return val[2] / symbolSize;
            },
            rippleEffect: {brushType: 'stroke'},
            label: {
              normal: {
                formatter: '{b}', position: 'left', show: false
              }
            },
            itemStyle: {
              normal: {
                color: 'yellow', shadowBlur: 10, shadowColor: 'yellow'
              }
            },
          }
        ],
        title: [
          // {
          //   text: '全国分布统计',
          //   left: 'center'
          // }, {
          //   text: '各省排名:',
          //   right: '10%',
          //   top: 60,
          //   width: 100,
          //   textStyle: {
          //     fontSize: 12
          //   }
          // },
        ],
        legend: {
          orient: 'vertical',
          left: '10',
          top: 40,
          width: 100,
          data: legendData,
          selectedMode: 'single',
          selected: {},
        },
        grid: {
          right: '0%',
          top: 100,
          bottom: 40,
          width: '30%'
        },
        xAxis: {
          position: 'top',
          type: 'value',
          boundaryGap: false,
          splitLine: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
        },
        yAxis: {
          type: 'category',
          data: [],
          axisTick: {
            alignWithLabel: true
          }
        },
      }
    };
  },
  created() {
    _this = this;
  }

};
</script>

<style scoped>

</style>

