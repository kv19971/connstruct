import { Meteor } from 'meteor/meteor';
import LineReader from 'readline';
import fs from 'fs';

Meteor.startup(() => {
  const lineReader = LineReader.createInterface({
      input: fs.createReadStream('/home/kenta/Desktop/connstruct/kenta/model.e2k')
  });

  let rawModel = {};

  let header;

  lineReader.on('line', line => {
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

  lineReader.on('close', () => {
      const frameSections = rawModel["FRAME SECTIONS"];
      const structures = _.compact(_.map(frameSections, data => {
          if (data.length > 2 && data[2].startsWith("MATERIAL")) {
              return {
                  type: JSON.parse(data[1].trim()),
                  material: JSON.parse(data[2].replace("MATERIAL ", "").trim())
              };
          }
      }));
      console.log(structures);
  });

});
