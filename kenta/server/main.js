import {Meteor} from 'meteor/meteor';
import LineReader from 'readline';
import fs from 'fs';

Meteor.startup(() => {
    // HTTP.get("https://query1.finance.yahoo.com/v7/finance/download/AAPL?period1=1483228800&period2=1485561600&interval=1d&events=history&crumb=IL3LmsQnD/q", {
    //     headers: {
    //         'Cookie': 'B=2hdri15cbbcnm&b=3&s=ip;'
    //     }
    // }, (err, res) => {
    //     if (!err) {
    //         const data = res.content.split("\r\n");
    //         _.each(data.slice(1), row => console.log(row))
    //     } else {
    //         console.log(err)
    //     }
    // })
    // const lineReader = LineReader.createInterface({
    //     input: fs.createReadStream('/home/kenta/Desktop/connstruct/kenta/model.e2k')
    // });
    //
    // let rawModel = {};
    //
    // let header;
    //
    // lineReader.on('line', line => {
    //     if (line.startsWith("$ ")) {
    //         header = line.replace("$ ", "");
    //     } else if (header) {
    //         let columns = _.compact(line.split("  "));
    //         if (header in rawModel) {
    //             rawModel[header].push(columns);
    //         } else {
    //             rawModel[header] = [columns];
    //         }
    //     }
    // });
    //
    // lineReader.on('close', () => {
    //     const frameSections = rawModel["LINE ASSIGNS"];
    //     const structures = _.compact(_.map(frameSections, data => {
    //         if (data.length > 2 && data[3].startsWith("SECTION")) {
    //             return {
    //                 id: JSON.parse(data[1].trim()),
    //                 floor: JSON.parse(data[2].trim()),
    //                 material: JSON.parse(data[3].replace("SECTION ", "").trim())
    //             };
    //         }
    //     }));
    //     console.log(structures);
    // });

});
