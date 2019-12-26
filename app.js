const express = require('express')
const app = express()
const port = 3000
const sfdx = require('sfdx');
const path = require('path');
var fs = require('fs');
var fsPath = require('fs-path');
app.set('view engine', 'ejs');
app.use(express.urlencoded())
//const router = express.Router();

//app.get('/', (req, res) => res.send('Hello World!'))
app.get('/',function(req,res){
  res.render('home');
 // res.sendFile(path.join(__dirname+'/index.html'));
  //__dirname : It will resolve to your project folder.
});

app.get("/allOrgs", (req, res) => {
	getAllOrgs().then((listResult) => {
		console.log('NEW Results ',JSON.parse(listResult).result.nonScratchOrgs);
 // res.status(200).send(listResult);
	
	//allorgs
	res.render('allorgs', { orgs: JSON.parse(listResult).result.nonScratchOrgs });
	});
});

app.get("/openOrg", (req, res) => {
console.log('opening org ');
let orgName = req.query.org;
openOrg(orgName).then((data)=>{
	
	console.log('ORG OPENED ');
})
//openOrg.
res.render('openOrg',{orgnameis:orgName});//, { orgs: JSON.parse(listResult).result.nonScratchOrgs });
});

app.get("/OrgInfo", (req, res) => {
console.log('getting org ');
let orgName = req.query.org;
getOrgInfo(orgName).then((data)=>{
	
	console.log('ORG data  ',data);
		console.log('org sdata ',JSON.parse(data));//.result.nonScratchOrgs);
 // 
})
//openOrg.
res.render('orgInfo',{orgnameis:orgName});//, { orgs: JSON.parse(listResult).result.nonScratchOrgs });
});

app.get("/addOrgForm", (req, res) => {

res.render('addOrg');//, { orgs: JSON.parse(listResult).result.nonScratchOrgs });
});



app.post("/authOrg", (req, res) => {
	console.log('req.body ',req.body);
const alName = req.body.aliasName;
console.log('>>>> alName ',alName);
authOrg(alName).then((data)=>{
	console.log('data ',data);
	res.end();
})
//res.end();//('addOrg');//, { orgs: JSON.parse(listResult).result.nonScratchOrgs });
});



app.get("/connect", (req, res) => {
console.log('opening org ');
let orgName = req.query.org;
res.render('orgConnected',{orgnameis:orgName});//, { orgs: JSON.parse(listResult).result.nonScratchOrgs });
});

app.get("/retrievemetadata", (req, res) => {
console.log('getting org metadata ');
let orgName = req.query.org;
//res.render('orgConnected',{orgnameis:orgName});//, { orgs: JSON.parse(listResult).result.nonScratchOrgs });
pullmetainfo(orgName).then((data)=>{
	
	
 res.send(data);
});
});





app.get("/pushmetadatatoorg", (req, res) => {
console.log('push metadata to org ');
let orgName = req.query.org;
//res.render('orgConnected',{orgnameis:orgName});//, { orgs: JSON.parse(listResult).result.nonScratchOrgs });
pushmetainfo(orgName).then((data)=>{
	
	
 res.send(data);
});
});


app.get("/renSoql", (req, res) => {
console.log('getting org metadata ');
let orgName = req.query.org;
//res.render('orgConnected',{orgnameis:orgName});//, { orgs: JSON.parse(listResult).result.nonScratchOrgs });
runSoqlcmd(orgName).then((data)=>{
	
	
 res.send(data);
});
});





app.get("/getMetaInfo", (req, res) => {
console.log('getting org metadata ');
let orgName = req.query.org;
let memberName = req.query.member;
//res.render('orgConnected',{orgnameis:orgName});//, { orgs: JSON.parse(listResult).result.nonScratchOrgs });
getMemberData(orgName,memberName).then((data)=>{
	
	
 res.send(data);
});
});


app.get("/getDeployableDataIs", (req, res) => {
console.log('getting org metadata ');
let orgName = req.query.org;
//let memberName = req.query.member;
//res.render('orgConnected',{orgnameis:orgName});//, { orgs: JSON.parse(listResult).result.nonScratchOrgs });
getDeployableData(orgName).then((data)=>{
	
	
 res.send(data);
});
});




app.get("/generatepackage", (req, res) => {
	
	res.render('generatepackage');
	
});


app.get("/migrate", (req, res) => {
console.log('getting org metadata ');
let orgName = req.query.org;
//res.render('orgConnected',{orgnameis:orgName});//, { orgs: JSON.parse(listResult).result.nonScratchOrgs });
getAllOrgs().then((data)=>{
	
	//migrateData
 //res.send(data);
 console.log('migrate data ',JSON.parse(data));
	var orgInfo =[];
	var AllOrgAliasNames = [];
	JSON.parse(data).result.nonScratchOrgs.forEach(function(eachOrg){
		AllOrgAliasNames.push(eachOrg.alias+' ( '+eachOrg.username+' )');
	});
//	console.log('AllOrgAliasNames ',AllOrgAliasNames);

	AllOrgAliasNames.forEach(function(eachFromAlias){

		AllOrgAliasNames.forEach(function(eachToAlias){
					if(eachFromAlias !=eachToAlias){
						orgInfo.push({
							'From' : eachFromAlias,
							'To':eachToAlias
						});
					}
		});
	
	});
console.log('orgInfo ',orgInfo);	
 res.render('migrateData',{orgs:orgInfo});//, { orgs: JSON.parse(listResult).result.nonScratchOrgs });

});
});





app.post("/generateXML", (req, res) => {
	console.log('req.body ',req.body.XML);
 generateXMLfile(req.body.XML,req.body.Alias);
//const alName = req.body.aliasName;
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))


  
  
function getAllOrgs() {
	
return 	sfdx.list({
	json:true
});//.then((result)=>{

}   

function getOrgInfo(orgName) {
	
	return  sfdx.orgInfo({
	   alias:orgName,
	   json:true
   });

}

function openOrg(orgName){
	
return sfdx.open({
	alias:orgName
});
}


function authOrg(alname){
	
	
	return sfdx.login({
	alias:alname,
	
});


}

function pullmetainfo(aliasName){
	
	return sfdx.pullmetadata({
	alias:aliasName
});
}

function pushmetainfo(aliasName){
	
	return sfdx.pushmetadata({
	alias:aliasName
});
}

function runSoqlcmd(aliasName){
	console.log('runSoqlcmd');
	return sfdx.runSoql({
	alias:aliasName,
	json:true
});


}


function getMemberData(alias,memberIs){
	
	return sfdx.getMembersData({
	alias:alias,
	json:true,
	member:memberIs
	
	
})



}

function generateXMLfile( fileData,AliasName){
	/***********
	
 console.log('fileData ',fileData);
// appendFile function with filename, content and callback function
fs.writeFile('C:\\Users\\UKiran.PI\\Desktop\\sfdxfiles1\\package.xml',fileData , function (err) {
  if (err) throw err;
  console.log('File is created successfully.');
}); 

*****************/
 fsPath.writeFile('C:\\Users\\UKiran.PI\\Desktop\\sfdxfiles\\'+AliasName+'\\package.xml', fileData, function(err){
  if(err) {
    throw err;
  } else {
	 // return 'C:\\Users\\UKiran.PI\\Desktop\\sfdxfiles\\'+AliasName+'\\package.xml';
    console.log('wrote a file like DaVinci drew machines');
  }
});
} 



function getDeployableData(alias){
	
	return sfdx.describeMetadata({
	alias:alias,
	json:true
	
	
})



}