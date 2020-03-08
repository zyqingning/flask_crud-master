
/**
 * 根据时间字符串获取年月
 * @param date
 * @returns {{mouth: number, year: number}}
 */
function getDate(date) {
    let dateO = new Date(date);
    let m = dateO.getMonth()+1;
    let y = dateO.getFullYear();
    return {'year': y, 'mouth': m}
}

/**
 * 获取所有参数的值
 * @returns {*}
 */
function getOptionStr(){
    let city = $('input[name="city"]').val();
    let year = $('#year option:checked').text();
    let type = $('#type option:checked').text();
    year = year == '请选择' ? '' : year;
    type = type == '请选择' ? '' : type;
    let str = city+year+type;
    return str;
}
/**
 * 图表
 * @type {{init: Chart.init, bar: Chart.bar, pieChat: Chart.pieChat, getPieData: (function(*): {value: Array, x_data: Array}), getQuarterDate: (function(*): Array), scatter: Chart.scatter, event: Chart.event, lineChat: Chart.lineChat, getData: (function(*): {value: Array, x_data: Array})}}
 */
let Chart = {
     axisLabel: {
      textStyle: {
        color: '#fff'
      }
    },
    axisLine: {
      lineStyle: {
          color: '#fff'
      }
    },
     itemStyle: {
      normal: {
          color: '#e76b53'
      }
    },
    chartColor: '#e76b53',
    getData: function(data) {
        let xData = [];
        let value = [];
        for(let i=0; i<data.length; i++) {
            xData.push(data[i]['date'])
            value.push(data[i]['total_data'])
        }
        return {'x_data': xData, 'value': value};
    },
    getLegend: function(){
        let type = $('#type option:checked').text();
        type = type == '请选择' ? '' : type+'';
        return  type+'亿元';
    },
    getQuarterDate: function (data) {
        let date = getDate(data['date']);
        let dataD = [];
        let dateStr = date['year']+'/'+(date['mouth']-2) + '-' +data['date'];
        switch (date.mouth) {
            case 3:
                dataD['text'] = '第一季度';
                break;
            case 6:
                dataD['text'] = '第二季度';
                break;
            case 9:
                dataD['text'] = '第三季度';
                break;
            case 12:
                dataD['text'] = '第四季度';
                break;
        }
        dataD['date'] = dateStr;
        return dataD;
    },
    getPieData: function (data) {
        let xData = [];
        let value = [];
        for(let i=0; i<data.length; i++) {
            let pip = data[i];
            if (pip['is_quarter'] == 1) {
                pip['date'] = this.getQuarterDate(pip)['text'];
            }
            xData.push(pip['date']);
            // 对数据进行拆分
            let item = {
                'name': pip['date'],
                'value': pip['total_data']
            };
            value.push(item)
        }
        return {'x_data': xData, 'value': value};
    },
    lineChat: function (data) {
        let res = this.getData(data)
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));
        myChart.clear();
        let legend = this.getLegend();
        // 指定图表的配置项和数据
        var option = {
            xAxis: {
                name: '时间',
                type: 'category',
                axisLabel: this.axisLabel,
                axisLine: this.axisLine,
                data: res.x_data
            },
            yAxis: {
                axisLabel: this.axisLabel,
                axisLine: this.axisLine,
                name: legend,
                type: 'value'
            },
            series: [{
                data: res.value,
                type: 'line',
                itemStyle: this.itemStyle,
                smooth: true
            }]
            };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    },
    bar: function (data) {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));
        myChart.clear();

        let res = this.getData(data);
        let legend = this.getLegend();
        // 指定图表的配置项和数据
        var option = {
            title: {
                text: getOptionStr()
            },
            tooltip: {},
            legend: {
                data:[legend]
            },
            xAxis: {
                axisLabel: this.axisLabel,
                axisLine: this.axisLine,
                data: res.x_data
            },
            yAxis: {
                 axisLabel: this.axisLabel,
                axisLine: this.axisLine,
            },
            series: [{
                name: legend,
                type: 'bar',
                itemStyle: this.itemStyle,
                 data: res.value
            }]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    },
    pieChat: function (data) {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));
        myChart.clear();
        let city = $('input[name="city"]').val();
        let res = this.getPieData(data);
        // console.log(res)
        // 指定图表的配置项和数据
        var option = {
            title : {
                text: city,
                subtext: '',
                x:'center'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: res.x_data
            },
            series : [
                {
                    name: '',
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data: res.value,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    },
    event: function () {

        $('#chart').change(function (e) {
            AjaxData.getData();
        })
    },
    init: function () {
        AjaxData.getData();
        this.event();
    }
};

// 数据请求完成后的操作：
/**
 * 1. 标题的更换
 * 2. 数据更新（根据所在的状态 tab 更新指定的数据）
 * 2.1 列表数据更新
 * 2.2 图表数据（默认第一个）
 * @param callback
 */

let AjaxData = {
    getData: function( ) {
        var index = layer.load(1, {
          shade: [0.1,'#fff'] //0.1透明度的白色背景
        });
        let city = $('input[name="city"]').val();
        let year = $('#year').val();
        let type = $('#type').val();
        let sub_type = $('#sub_type').val();
        let that = this;
        $.get('/economic?city='+city+'&type='+type+'&sub_type='+sub_type+'&date='+year+'', function (data) {
            console.log("查询条件：city:", city,'year:', year, 'type:', type, ', sub_type:', sub_type)
            console.log("数据:", data);
            if (data.length == 0) {
                $('#no-data').show();
            } else {
                that.callback(data);
            }
            layer.close(index)
        });
    },
    callback: function (data) {
        // let index = $('input[name="index"]').val();
        let chart = $('#chart').val();
        switch (chart) {
            case 'line':
                Chart.lineChat(data);
                break;
            case 'bar':
                Chart.bar(data);
                break;
            case 'pie':
                Chart.pieChat(data);
                break;
            default:
                 Chart.lineChat(data);
                break;
        }
        this.createTableByData(data);
    },
    /**
     * 创建表格
     * @param data
     */
    createTableByData: function(data){
        // title
        let html = '<div class="topTitle clearfix">' +
            '<h4 class="title"></h4>' +
            '<div class="listEco scroller">' +
            '<table width="100%" cellpadding="0" cellspacing="0"><thead></thead><tbody></tbody></table>' +
            '</div>' +
            '</div>';
        $('.listEcoContainer').html(html);
        $('#no-data').hide();
        this.setTitle();
        this.createTableHeader();
        // create table
        this.setTableData(data);
    },
    setTitle: function () {
        let city = $('input[name="city"]').val();
        let year = $('#year option:checked').text();
        let type = $('#type option:checked').text();
        year = year == '请选择' ? '' : year;
        type = type == '请选择' ? '' : type;
        let str = city+year+type;
        $('.topTitle>h4').html(str);
    },
    createTableHeader: function(){
        $('.listEco thead').html('');
        let h = '<tr><td width="30"></td><td width="120" style="text-align: center">时间</td><td>金额</td></td></tr>';
        $('.listEco thead').html(h);
    },
    setTableData: function (data) {
        console.log('clear table')
        $('.listEco tbody').html('');
        $.each(data, function (i, item) {
            let index = i + 1;
            let html = '<tr class="ybp-common-table-list undefined">\n' +
                '<td style="text-align: center">' +
                '    <div>' +
                '        <div class="list-rank-title">' +
                '            <span class="list-rank-icon" style="background: rgb(240, 105, 71);">' +index+'</span>' +
                '        </div>' +
                '    </div>' +
                '</td>' +
                '<td style="text-align: center;">' +
                '    <div>' +
                '        <div class="list-rank-title">'+item['date']+'</div>' +
                '    </div>' +
                '</td>' +
                '<td>' +
                '    <div>' +
                '        <div class="list-rank-title">'+item['total_data']+' 亿元</div>' +
                '</td>' +
                '</tr>';
            $('.listEco tbody').append(html)
        });
    }
};

/**
 * 地图
 * @type {{init: Map.init, selectCity: Map.selectCity, createMap: Map.createMap}}
 */
let Map = {
    createMap: function () {
        // map
        map = new BMap.Map("allmap");
        // 创建地图实例
        var point = new BMap.Point(116.404, 39.915);
        map.centerAndZoom(point, 15);
        // 根据 IP 定位到当前城市
        let city = new BMap.LocalCity();
        city.get(function(e) {
            // 设置导航栏显示
            let city = e.name.substr(0, e.name.length-1)
            $('#location .text').text(city);
            $('input[name="city"]').val(city)
            // 设置地图中心为当前城市
            map.setCenter(city);
            map.addEventListener('click', function(){
                $('.economic').show()
            });
        });

        // map.centerAndZoom('德阳', 15);
        // 创建点坐标
        // var map = new BMap.Map("allmap");  // 创建Map实例
        // map.centerAndZoom("四川",15);      // 初始化地图,用城市名设置地图中心点
    },
    selectCity: function () {
        $('#location .model>.rml-city-btn').click(function(e){
            let city = $(this).text();
            $('input[name="city"]').val(city);
            // 样式变化
            $('#location .model>.rml-city-btn').removeClass('active');
            $(this).addClass('active');
            $('#location .text').text(city);
            $('#location .model').hide();
            // 数据变化
            map.centerAndZoom(city, 15);
            AjaxData.getData();

        });
    },
    init: function () {
        this.createMap();
        this.selectCity();
    }
};

/**
 * Tab 切换
 * @type {{init: Tab.init, tabEvent: Tab.tabEvent}}
 */
let Tab = {
    tabEvent: function () {
        $('.buttonGroup>.radio').click(function (e) {
            let index = $(this).index();
            $('input[name="index"]').val(index);
            $(this).addClass('active').siblings().removeClass('active');
            $('.ecoListContainer>div').eq(index).show().siblings().hide();
            Select.showChartSelect();
        });
    },
    init: function () {
        $('input[name="index"]').val(0);
        this.tabEvent();
    }
};

let Select = {
    data: [
        {
            'name': '地区生产总值',
            'type': 1,
            'child': [
                {
                    'sub_type': 1,
                    'sub_name': '第一产业'
                },
                {
                    'sub_type': 2,
                    'sub_name': '第二产业'
                },
                {
                    'sub_type': 3,
                    'sub_name': '第三产业'
                },
            ]
        }, {
            'name': '社会消费品总额',
            'type': 2,
            'child': [
                {
                    'sub_type': 4,
                    'sub_name': '城镇'
                },
                {
                    'sub_type': 5,
                    'sub_name': '农村'
                }
            ]
        }, {
            'name': '固定资产投资',
            'type': 3,
            'child': [
                {
                    'sub_type': 6,
                    'sub_name': '第一产业投资'
                },
                {
                    'sub_type': 7,
                    'sub_name': '第二产业投资'
                },
                 {
                    'sub_type': 8,
                    'sub_name': '第三产业投资'
                }
            ]
        }
    ],
    year: [
        {'year': 2014, 'text': '2014年'},
        {'year': 2015, 'text': '2015年'},
    ],
    createYearSelect: function(){
        $.each(this.year, function (i, item) {
           $('#year').append('<option value="'+item['year']+'" data-index="'+i+'">'+item['text']+'</option>');
        });
    },
    clear: function(node){
        return node.html('<option value="-1">请选择</option>')
    },
    init: function () {
        this.createYearSelect();
        this.event();
    },
    event: function () {
        let that = this;
        $('#year').change(function () {
            that.clear($('#type'));
            that.clear($('#sub_type'));
            $.each(that.data, function (i, item) {
                $('#type').append('<option value="'+item['type']+'" data-index="'+i+'">'+item['name']+'</option>')
            });
            that.showChartSelect();
            $('#type').change(function () {
                that.clear($('#sub_type'));
                let index = $('#type option:selected').data('index');
                let child = that.data[index]['child'];
                $.each(child, function (i, item) {
                    $('#sub_type').append('<option value="'+item['sub_type']+'">'+item['sub_name']+'</option>')
                });
                that.showChartSelect();
                $('#sub_type').change(function () {
                    that.showChartSelect();
                    // 加载数据
                   AjaxData.getData();
                });
                AjaxData.getData();
            });
            AjaxData.getData();
        });
    },
    showChartSelect: function () {
        let index = $('input[name="index"]').val();
       if (index == 1) {
           $('#chart').show();
       }
    }
};
let Location = {
    init: function () {
        this.showLocation();
    },
    showLocation: function (){
        $("#location>.wrapper").click(function(e) {
            /*if (isShow) {
                $('.model').hide();
                isShow = 0;
            } else {
                $('.model').show();
                isShow = 1;
            }*/
            $('.model').show();
        });
    }
};

let UploadExcel = {
    init: function () {

    },
    upload: function () {
        
    },
    loadModel: function () {

    }
}
$(function () {
    Location.init();
    Map.init();
    Tab.init();
    Select.init();
    // Cate.init();
    Chart.init();
});