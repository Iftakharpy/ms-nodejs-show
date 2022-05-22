const fs = require("fs").promises;
const path = require("path");


main();

async function main() {
  const salesDir = path.join(__dirname, 'stores')
  const salesTotalDir = path.join(__dirname, 'salesTotals')

  // Create the report directory
  try{
    await fs.mkdir(salesTotalDir)
  } catch{
    console.log(salesTotalDir, 'already exists!')
  }
  
  let salesFiles = await findSalesFiles(salesDir)

  let reportPath = path.join(salesTotalDir, 'report.json')
  try{
    await fs.unlink(reportPath)
  }catch{
    console.log('Could not remove file', reportPath)
  }

  let reportData = {
    totalSales: await calulateSalesTotal(salesFiles),
    totalStores: salesFiles.length
  }

  await fs.writeFile(reportPath, JSON.stringify(reportData, undefined, space=4))
  console.log('Sales report written to', reportPath)
}

async function findSalesFiles(folderName) {
  let storeSalesFiles = [];

  const filePaths = await fs.readdir(folderName, { withFileTypes: true });

  for (let filePath of filePaths) {
    let nestedPath = path.join(folderName, filePath.name);

    if (filePath.isDirectory()) {
      let nestedFiles = await findSalesFiles(nestedPath);
      storeSalesFiles.push(...nestedFiles);
    } else if (path.extname(nestedPath) ==='.json') {
      storeSalesFiles.push(nestedPath);
    }
  }

  return storeSalesFiles;
}

async function calulateSalesTotal(salesFiles){
  let salesTotal = 0;
  
  for (let file of salesFiles){
    let fileContent = await fs.readFile(file)
    let parsedData = JSON.parse(fileContent)
    
    salesTotal+=parsedData.total
  }

  return salesTotal
}
