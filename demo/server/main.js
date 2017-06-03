import {Meteor} from 'meteor/meteor';
import fs from 'fs';

const c = 0.99;

Meteor.startup(() => {
    Materials.remove({});
    Suppliers.remove({});

    supplierList = [{name: 'HAYN', rating: 0.45, location: [39.768377, -86.158042], materials: []},
        {name: 'AKS', rating: 0.92, location: [39.768377, -86.158042], materials: []},
        {name: 'MT', rating: 0.67, location: [39.768377, -86.158042], materials: []},
        {name: 'CRS', rating: 0.12, location: [39.768377, -86.158042], materials: []},
        {name: 'CMC', rating: 0.32, location: [39.768377, -86.158042], materials: []},
        {name: 'PKX', rating: 0.18, location: [39.768377, -86.158042], materials: []},
        {name: 'TS', rating: 0.68, location: [39.768377, -86.158042], materials: []},
        {name: 'TMST', rating: 0.91, location: [39.768377, -86.158042], materials: []},
        {name: 'X', rating: 0.50, location: [39.768377, -86.158042], materials: []},
        {name: 'WOR', rating: 0.77, location: [39.768377, -86.158042], materials: []}];

    _.each(supplierList, element => {
        if (!Suppliers.findOne({name: element.name})) Suppliers.insert(element);
    })

    let rawModel = {};

    let header;

    _.each(fs.readFileSync('C:/Users/Victor/Desktop/connstruct/demo/model.e2k').toString().split('\r\n'), line => {
        if (line.startsWith("$ ")) {
            header = line.replace("$ ", "");
        } else if (header) {
            let columns = _.compact(line.split("  "));
            if (header in rawModel) {
                rawModel[header].push(columns);
            } else {
                rawModel[header] = [columns];
            }
        }
    });

    const frameSections = rawModel["LINE ASSIGNS"];
    const structures = _.compact(_.map(frameSections, data => {
        if (data.length > 2 && data[3].startsWith("SECTION")) {
            return {
                id: JSON.parse(data[1].trim()),
                floor: JSON.parse(data[2].trim()),
                material: JSON.parse(data[3].replace("SECTION ", "").trim())
            };
        }
    }));

    //steelPriceEndPoint= HTTP.get('https://www.quandl.com/api/v1/datasets/LME/PR_FM.json');
    _.each(structures, element => {
        randSupplier = Suppliers.findOne({}, {skip: Math.random() * Suppliers.find().count()});
        var qly = Math.random();
        Materials.insert(
            {
                name: element.material,
                prices: [{
                    time: Date.now(),
                    price: steelPriceEndPoint.data.data[Math.floor(Math.random() * steelPriceEndPoint.data.data.length)][1]
                }],
                quantity: Math.floor(Math.random() * 100000) + 5000,
                rating: randSupplier.rating * qly,
                quality: qly,
                supplierId: randSupplier._id
            }, function (err, id) {
                Suppliers.update({_id: randSupplier},
                    {$push: {materials: id}})
            })
    });

    // console.log(Materials.find().count() + " materials inserted")

    var count = 0;
    Meteor.setInterval(function () {
        if (count % 1000 === 0 && count != 0) {
            Materials.find().forEach(function (item) {
                var prices = item.price;
                prices.splice(0, 1);
                Materials.update({_id: item._id}, {$set: {price: prices}})
            })
        }
        Materials.find().forEach(function (item) {
            Materials.update({_id: item._id},
                {
                    $push: {
                        prices: {
                            time: Date.now(), price: c * item.prices[item.prices.length - 1].price
                            + (1 - c) * steelPriceEndPoint.data.data[Math.floor(Math.random() * steelPriceEndPoint.data.data.length)][1]
                        }
                    }
                })
        })
    }, 10000)
});
