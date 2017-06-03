/**
 * Created by kenta on 6/3/17.
 */
var jsnx = require("jsnetworkx");
Template.suppliers.viewmodel({
    onCreated() {
        console.log("On suppliers page.");
    },
    onRendered() {
        var G = new jsnx.Graph();
        G.addNodesFrom([
                [1, {color: 'red', name:"Supplier A"}],
                [2, {color: 'green', name:"Supplier B"}],
                [3, {color: 'white', name: "Supplier C"}]
            ]);
            
            G.addEdgesFrom([[1,2], [1,3]]);
            
            // `jsnx.draw` accept a graph and configuration object
            jsnx.draw(G, {
            element: '#canvas',
            withLabels: true,
            nodeStyle: {
                fill: function(d) {
                    return d.data.color;
                }
            },
            nodeAttr: {
                r: 10,
                title: function(d) { return d.data.name;}
            }
            });
    }
})