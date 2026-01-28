import NekowebAPI from "@indiefellas/nekoweb-api";
import AdmZip from "adm-zip";
import Deploy from "./deploy.json" with { type: "json" }

const outFolder = "out"

/**
* Deploys 11ty site to Nekoweb
* @param {string} outFolder
*/
console.log('[Deploy] Deploying to Nekoweb...')
const zip = new AdmZip();
var folder = Deploy.nekowebFolder
if (!folder.startsWith("/")) folder = "/" + Deploy.nekowebFolder
zip.addLocalFolder(outFolder, folder)
const nekowebApi = new NekowebAPI({
  apiKey: Deploy.nekowebApiKey,
  logging: (t, m) => console.log(`[Deploy] ${m}`)
})
const zipBuffer = await zip.toBufferPromise()
const bigFile = await nekowebApi.createBigFile()
await bigFile.append(zipBuffer)
try {
  await nekowebApi.delete(folder)
} catch (error) {
  console.log('[Deploy] No existing folder to delete (this is fine for first deploy)')
}
await bigFile.import("/")
const siteInfo = await nekowebApi.getSiteInfo(folder.replace(/^\//, "").split("/")[0])
console.log('[Deploy] Done! You can now check it on', 'https://' + siteInfo.domain)
