import { Meteor } from 'meteor/meteor';
import LineReader from 'readline';
import fs from 'fs';

Meteor.startup(() => {
  const lineReader = LineReader.createInterface({
      input: fs.createReadStream('/home/tavish/Desktop/connstruct/tavish/simple-todos/model.e2k')
  });

  supplierList= [ {name:'HAYN', rating: 0.45, location: [39.768377, -86.158042], materials: []}, 
                  {name:'AKS', rating: 0.92, location: [40.730610, -73.935242], materials: []},
                  {name:'MT', rating :0.67, location: [25.761681, -80.191788], materials: []},
                  {name: 'CRS', rating: 0.12, location: [21.761681, -10.191788], materials: []},
                  {name: 'CMC',  rating: 0.32, location: [25.761681, -55.191788], materials: []},
                  {name: 'PKX', rating: 0.18, location: [15.761681, -80.191788], materials: []},
                  {name: 'TS', rating: 0.68, location: [23.761681, -83.191788], materials: []},
                  {name: 'TMST', rating: 0.91, location: [28.761681, -19.191788], materials: []},
                  {name: 'X', rating: 0.50, location: [60.761681, 14.191788], materials: []},
                  {name: 'WOR', rating: 0.77, location: [15.761681, 87.191788], materials: []}];
  
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

  steelPriceEndPoint= HTTP.get('https://www.quandl.com/api/v1/datasets/LME/PR_FM.json');
  console.log(steelPriceEndPoint.data.data[steelPriceEndPoint.data.data.length-1][1]);
  _.each(structures, element => {
  randSupplier= Suppliers.findOne({}, { skip:  Math.random() * Suppliers.find().count() })._id;
  Materials.insert(
    { name: element.material, 
      price: steelPriceEndPoint.data.data[Math.floor(Math.random() * steelPriceEndPoint.data.data.length)][1],
      quantity: Math.floor(Math.random() * 100000) + 5000, 
      quality:Math.random(),
      supplierId: randSupplier    
    }, function (err, id)
    {
        console.log(id);
        Suppliers.update({_id: randSupplier},
        { $push: { materials: id}})
    })
  });
  Meteor.setInterval(function ()
  {
    Materials.find().forEach(function(item)
    {
      Materials.update({name: item.name}, 
      {$set: 
        {price: steelPriceEndPoint.data.data[Math.floor(Math.random() * steelPriceEndPoint.data.data.length)][1]}})
    })
  }, 10000)
});
