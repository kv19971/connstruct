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
        updatedMaterials.push({_id: item._id, updatedPrice: 0.001 * dist + item.price, quantity: item.quantity});
    })
    updatedMaterials.sort(function (a, b) {
        return parseFloat(a.price) - parseFloat(b.price);
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

Meteor.methods({
    'materials.get'(materials, minQuality, lat, lng, quantity, budget){
        var allMaterialsUsed = [];
        var b = budget;
        for (let i = 0; i < materials.length; i++) {
            allMaterialsUsed.push(getMaterial(materials[i], minQuality, lat, lng, quantity, b));
        }
        return allMaterialsUsed;
    }
})