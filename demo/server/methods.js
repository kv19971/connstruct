import fs from 'fs';

var c = 0.99;

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function getMaterial(materialName, minQuality, lat, lng, quantity, b) {
    var q = quantity;
    var updatedMaterials = [];
    Materials.find({name: materialName, rating: {$gte: minQuality}})
        .fetch().forEach(function (item) {
        var supplyLoc = Suppliers.findOne({_id: item.supplierId}).location;
        var dist = getDistanceFromLatLonInKm(supplyLoc[0], supplyLoc[1], lat, lng);
        updatedMaterials.push({
            _id: item._id, updatedPrice: 0.001 * dist + item.prices[item.prices.length - 1].price,
            quantity: item.quantity
        });
    })
    updatedMaterials.sort(function (a, b) {
        return parseFloat(a.updatedPrice) - parseFloat(b.updatedPrice);
    });
    var materialsUsed = [];
    for (let i = 0; i < updatedMaterials.length; i++) {
        const item = updatedMaterials[i];
        if (item.quantity <= q) {
            b -= item.updatedPrice * item.quantity;
            if (b < 0) return "insufficient budget!";
            materialsUsed.push(Materials.findOne({_id: item._id}));
            q -= item.quantity;
        }
        else {
            b -= item.updatedPrice * q;
            if (b < 0) return "insufficient budget!";
            materialsUsed.push(Materials.findOne({_id: item._id}));
            q = 0;
            break;
        }
    }
    return materialsUsed;
}

function getFuture(materialName, minQuality, lat, lng, quantity, b, start, deadline) {
    var q = quantity;
    var updatedMaterials = [];
    Materials.find({name: materialName, rating: {$gte: minQuality}})
        .fetch().forEach(function (item) {
        var supplyLoc = Suppliers.findOne({_id: item.supplierId}).location;
        var dist = getDistanceFromLatLonInKm(supplyLoc[0], supplyLoc[1], lat, lng);
        item.prices.forEach(function (priceObj) {
            if (priceObj.time > start && priceObj.time < deadline) {
                updatedMaterials.push({
                    _id: item._id, updatedPrice: 0.01 * dist + priceObj.price,
                    quantity: item.quantity, time: priceObj.time
                });
            }
        })
    })
    updatedMaterials.sort(function (a, b) {
        return parseFloat(a.updatedPrice) - parseFloat(b.updatedPrice);
    });
    var materialsUsed = [];
    for (let i = 0; i < updatedMaterials.length; i++) {
        const item = updatedMaterials[i];
        if (item.quantity <= q) {
            b -= item.updatedPrice * item.quantity;
            if (b < 0) return "insufficient budget!";
            materialsUsed.push(updatedMaterials[i]);
            q -= item.quantity;
        }
        else {
            b -= item.updatedPrice * q;
            if (b < 0) return "insufficient budget!";
            materialsUsed.push(updatedMaterials[i]);
            q = 0;
            break;
        }
    }
    return materialsUsed;
}

Meteor.methods({
    'materials.get'(materials, minQuality, lat, lng, quantity, budget){
        var allMaterialsUsed = [];
        var b = budget;
        for (let i = 0; i < materials.length; i++) {
            allMaterialsUsed.push(getMaterial(materials[i], minQuality, lat, lng, quantity, b));
        }
        allMaterialsUsed = _.map(allMaterialsUsed, material => {
            return _.map(material, supplier => {
                supplier.supplier = Meteor.call('supplier.get', supplier.supplierId);
                return supplier;
            });
        });
        console.log(allMaterialsUsed)
        return allMaterialsUsed;
    },
    'supplier.get'(supplierId){
        return Suppliers.findOne({_id: supplierId});
    },
    'future.get'(materials, minQuality, lat, lng, quantity, budget, start, deadline){
        var allMaterialsUsed = [];
        var b = budget;
        for (let i = 0; i < materials.length; i++) {
            allMaterialsUsed.push(getFuture(materials[i], minQuality, lat, lng, quantity, b, start, deadline));
        }
        return allMaterialsUsed;
    },
    'model.materials'() {
        let rawModel = {};

        let header;

        _.each(fs.readFileSync('/home/kv19971/angel/connstruct/demo/model.e2k').toString().split('\r\n'), line => {
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
        let counts = _.groupBy(structures, 'material');
        for (let key in counts) {
            counts[key] = counts[key].length;
        }
        return counts;
    },

})