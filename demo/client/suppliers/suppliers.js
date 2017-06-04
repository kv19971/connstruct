/**
 * Created by kenta on 6/3/17.
 */
import { Session } from 'meteor/session';
let jsnx = require("jsnetworkx");
Template.suppliers.viewmodel({
    onCreated() {
        Session.setDefault({"materials": []});
        console.log("On suppliers page.");
    },
    onRendered() {
        let G = new jsnx.Graph();
console.log(Session.get("quality"));
                        console.log(Session.get("budget"));
        Meteor.call('model.materials', (err, res) => {
            if (!err) {
                console.log(Session.get("quality"));
                        console.log(Session.get("budget"));
                const materials = Object.keys(res);
                const quantity = _.reduce(_.flatten(res), (val, acc) => val += acc, 0);

                console.log(materials)
                console.log(quantity)

                Meteor.call('materials.get', materials, parseFloat(Session.get("quality")) / 100.0, 39.768377, -86.158042,
                    quantity, parseFloat(Session.get("budget")), (err, res) => {

                        Session.set("materials", materials);
                        
                        if (err) {
                            alert(err);
                        } else {

                            let col = d3.scale.linear()
                                .domain([0, 0.5, 1])
                                .range(['red', 'orange', 'green']);

                            let nodes = [
                                ["Center", {
                                    color: 'white', name: "center", toString: function () {
                                        return "center";
                                    }
                                }]
                                // [1, {color: 'red', name:"A"}],
                                // [2, {color: 'green', name:"B"}],
                                // [3, {color: 'white', name: "C"}]
                            ];

                            let edges = []
                            let materialIndex = 0;
                            _.each(res, material => {
                                nodes.push([materials[materialIndex], {color: 'blue', name: materials[materialIndex]}]);
                                edges.push(["Center", materials[materialIndex]])
                                _.each(material, supplier => {
                                    nodes.push([supplier.supplier.name, {
                                        color: col(supplier.rating),
                                        name: supplier.supplier.name
                                    }]);
                                    console.log(supplier.supplier.name)
                                    edges.push([materials[materialIndex], supplier.supplier.name]);
                                })
                                materialIndex++;
                            })

                            G.addNodesFrom(nodes);
                            G.addEdgesFrom(edges);

                            jsnx.draw(G, {
                                element: '#canvas',
                                withLabels: true,
                                nodeStyle: {
                                    fill: function (d) {
                                        return d.data.color;
                                    }
                                },
                                nodeShape: 'circle',
                                nodeAttr: {
                                    r: 40,
                                    label: function (d) {
                                        return d.data.name;
                                    }
                                },
                                labelAttr: {
                                    // "text-anchor": "middle
                                },
                                layoutAttr: {
                                    linkDistance: 120,
                                    charge: -5999
                                },
                            });
                        }
                    });
            }
        })


        // `jsnx.draw` accept a graph and configuration object
    }
})