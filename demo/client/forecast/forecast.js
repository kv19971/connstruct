
import Chart from 'chart.js';

import './forecast.html';
function dateToYMD(date) {
    var d = date.getDate();
    var m = date.getMonth() + 1;
    var y = date.getFullYear();
    return '' + y + '-' + (m<=9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
}
Template.forecast.viewmodel({
    onRendered: function(){
        Meteor.call('future.get', Session.get("materials"), parseFloat(Session.get("quality"))/100, 39.768377, -86.158042, 1, parseFloat(Session.get("budget")), 1, 99999999999999999999999999999, (err, res) => {
            if (!err) {
                console.log(res[0][0]);
                var ctx = document.getElementById("myChart").getContext('2d');
                var myChart = new Chart(ctx, {
                    type: 'line',
                    data: {  
                        labels: res[0][0].priceHistory.map((val)=> {return dateToYMD(new Date(val.time))}),
                        datasets: [{
                            label: 'Time',
                            data: res[0][0].priceHistory.map((val)=> {return val.price}),
                            borderColor: "#1A1110"

                        }]
                    },
                    options: {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero:true
                                }
                            }]
                        }
                    }
                });
            } else {
                console.log(err);
            }
        })
        
    }
});

