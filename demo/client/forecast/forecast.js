
import Chart from 'chart.js';

import './forecast.html';

Template.forecast.viewmodel({
    onRendered: function(){
        Meteor.call('future.get', Session.get("materials"), parseFloat(Session.get("quality"))/100, 39.768377, -86.158042, 1, parseFloat(Session.get("budget")), 1, 99999999999999999999999999999, (err, res) => {
            if (!err) {
                console.log(res.data);
                var ctx = document.getElementById("myChart").getContext('2d');
                var myChart = new Chart(ctx, {
                    type: 'line',
                    data: {  
                        datasets: [{
                            label: '# of Votes',
                            data: [12, 19, 3, 5, 2, 3],
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

