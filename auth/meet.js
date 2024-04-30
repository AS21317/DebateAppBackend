import fs from 'fs/promises';
import path from 'path';
import process from 'process';
import { authenticate } from '@google-cloud/local-auth';
import { google } from 'googleapis';

import Host from "../models/HostSchema.js";


// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar'];

// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.

// const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

/**
 * Reads previously authorized credentials from the save file.
 * @param {string} id
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist(id) {
  try {
    const host = await Host.findById(id).select("gToken");
    const credentials = JSON.parse(host.gToken);

    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client, id) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const gToken = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  
  try{
    await Host.findByIdAndUpdate(
      id,
      { gToken: gToken },
    );

    console.log("gToken Saved Successfully");
  }catch(err){
    console.log("Error while Saving gToken: ", err);
  }
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize(id) {
  let client = await loadSavedCredentialsIfExist(id);
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client,id);
  }
  return client;
}

export default authorize;