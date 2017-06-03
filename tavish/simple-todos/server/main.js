import { Meteor } from 'meteor/meteor';
import LineReader from 'readline';
import fs from 'fs';

var c = 0.99;

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function getMaterial (materialName, minQuality, lat, lng, quantity, b){
    var q = quantity;
    var updatedMaterials = [];
    Materials.find({name : materialName, rating : {$gte : minQuality}})
    .fetch().forEach(function(item)
    {
      var supplyLoc = Suppliers.findOne({_id: item.supplierId}).location;
      var dist = getDistanceFromLatLonInKm(supplyLoc[0],supplyLoc[1],lat,lng);
      updatedMaterials.push({_id: item._id, updatedPrice: 0.001 * dist + item.prices[item.prices.length-1].price,
         quantity: item.quantity});
    })
    updatedMaterials.sort(function(a, b) {
    return parseFloat(a.updatedPrice) - parseFloat(b.updatedPrice);
  });
    var materialsUsed = [];
    for (let i = 0; i < updatedMaterials.length; i++) {
      const item = updatedMaterials[i];
      if(item.quantity<=q)
      {
        b -= item.updatedPrice*item.quantity;
        if(b<0) return "insufficient budget!";
        materialsUsed.push(Materials.findOne({_id: item._id}));
        q -= item.quantity;
      } 
      else
      {
        b -= item.updatedPrice*q;
        if(b<0) return "insufficient budget!";
        materialsUsed.push(Materials.findOne({_id: item._id}));
        q=0;
        break;
      }
    }
    return materialsUsed;
  }

function getFuture (materialName, minQuality, lat, lng, quantity, b, start, deadline){
    var q = quantity;
    var updatedMaterials = [];
    Materials.find({name : materialName, rating : {$gte : minQuality}})
    .fetch().forEach(function(item)
    {
      var supplyLoc = Suppliers.findOne({_id: item.supplierId}).location;
      var dist = getDistanceFromLatLonInKm(supplyLoc[0],supplyLoc[1],lat,lng);
      item.prices.forEach(function(priceObj)
      {
        if(priceObj.time>start && priceObj.time<deadline)
        {
          console.log(priceObj.price);
          updatedMaterials.push({_id: item._id, updatedPrice: 0.01 * dist + priceObj.price,
          quantity: item.quantity, time: priceObj.time});
        }
      })
    })
    updatedMaterials.sort(function(a, b) {
    return parseFloat(a.updatedPrice) - parseFloat(b.updatedPrice);
  });
    var materialsUsed = [];
    for (let i = 0; i < updatedMaterials.length; i++) {
      const item = updatedMaterials[i];
      if(item.quantity<=q)
      {
        b -= item.updatedPrice*item.quantity;
        if(b<0) return "insufficient budget!";
        materialsUsed.push(updatedMaterials[i]);
        q -= item.quantity;
      } 
      else
      {
        b -= item.updatedPrice*q;
        if(b<0) return "insufficient budget!";
        materialsUsed.push(updatedMaterials[i]);
        q=0;
        break;
      }
    }
    return materialsUsed;
  }

Meteor.methods({
    'materials.get'(materials, minQuality, lat, lng, quantity, budget){
      var allMaterialsUsed= [];
      var b = budget;
      for(let i=0;i<materials.length;i++)
      {
          allMaterialsUsed.push(getMaterial(materials[i], minQuality, lat, lng, quantity, b));
      }
      return allMaterialsUsed;
    },
    'supplier.get'(supplierId){
      return Suppliers.findOne({_id: supplierId});
    },
    'future.get'(materials, minQuality, lat, lng, quantity, budget, start, deadline){
      var allMaterialsUsed= [];
      var b = budget;
      for(let i=0;i<materials.length;i++)
      {
          allMaterialsUsed.push(getFuture(materials[i], minQuality, lat, lng, quantity, b, start, deadline));
      }
      return allMaterialsUsed;
  }})
    

Meteor.startup(() => {
  Materials.remove({});
  Suppliers.remove({});
  console.log("count m" + Materials.find().count());
  console.log("count s" + Suppliers.find().count());

  const lineReader = LineReader.createInterface({
      input: fs.createReadStream('/home/tavish/Desktop/connstruct/tavish/simple-todos/model.e2k')
  });

  supplierList= [ {name:'HAYN', rating: 0.45, location: [39.768377, -86.158042], materials: []}, 
                  {name:'AKS', rating: 0.92, location: [39.768377, -86.158042], materials: []},
                  {name:'MT', rating :0.67, location: [39.768377, -86.158042], materials: []},
                  {name: 'CRS', rating: 0.12, location: [39.768377, -86.158042], materials: []},
                  {name: 'CMC',  rating: 0.32, location: [39.768377, -86.158042], materials: []},
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

  _.each(fs.readFileSync('/home/tavish/Desktop/connstruct/tavish/simple-todos/model.e2k').toString().split('\r\n'), line => {
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
  randSupplier= Suppliers.findOne({}, { skip:  Math.random() * Suppliers.find().count() });
  var qly = Math.random();
  Materials.insert(
    { name: element.material, 
      prices: 
      [{time: Date.now(), price: 
        steelPriceEndPoint.data.data[Math.floor(Math.random() * steelPriceEndPoint.data.data.length)][1]}],
      quantity: Math.floor(Math.random() * 100000) + 5000,
      rating: randSupplier.rating*qly, 
      quality: qly,
      supplierId: randSupplier._id    
    }, function (err, id)
    {
        Suppliers.update({_id: randSupplier},
        { $push: { materials: id}})
    })
  });

  // console.log(Materials.find().count() + " materials inserted")
  
  var count = 0;
  Meteor.setInterval(function ()
  {
    if(count%1000===0 && count!=0)
    {
      Materials.find().forEach(function(item)
      {
        var prices = item.price;
        prices.splice(0,1);
        Materials.update({_id:item._id},{$set: {price: prices}})
      })
    }
    Materials.find().forEach(function(item)
    {
      Materials.update({_id: item._id}, 
      {$push: 
        {prices: {time: Date.now(), price : c * item.prices[item.prices.length-1].price 
          + (1-c) * steelPriceEndPoint.data.data[Math.floor(Math.random() * steelPriceEndPoint.data.data.length)][1]}}})
    })
  }, 10000)
});
