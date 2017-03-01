# Polarity Wikipedia Integration

Polarity's Wikipedia integration gives users access
In order for the Wikipedia Integration to execute a query, there needs to be information that is tagged in the Polarity Platform.


## Installation of Wikipedia Integration

You can install an integration either through downloading the file from github, or by using git to clone the repo into your instance.


#### Download Zip File

1. Click the `Clone or Download` button
2. Select `Download Zip`
3. Upload the zip file to your Polarity-Server
4. Move the zip file to:

 `mv filename /polarity-server/integrations`
5. Once the file has been moved, navigate to integrations folder:

  `cd /polarity-server/integrations`

6. Extract the zip by running the following command:

    `unzip /wikipedia`

7. Navigate into the folder that was unzipped
8. Run the following command to install the integration:

  `npm install --prefix=.`

9. Restart your Polarity-Server
10. Navigate to Polarity-Web and start the integration

#### GIT Clone

1. Navigate to integrations folder:

  `cd /polarity-server/integrations`

2. Run the following git command:

  `git clone https://github.com/polarityio/integrationname`

3. Switch to the appropriate branch of the integration:

  `git checkout branch name`

4. Run the following command to install the integration:

  `npm install --prefix=.`

5. Restart your Polarity-Server
6. Navigate to Polarity-Web and start the integration

## Wikipedia Settings

There are two main settings in Wikipedia integration

#### Search Parameters

As a user you have the ability to control the search parameters you want to perform.

  **Parameters**

    1. Fuzzy - Default search, supports typo correction.
    2. Strict - Few punctuation characters are removed but diacritics and stress marks are kept in search.
    3. Normal - Allows few punctuation characters, some diacritics and stop words are removed.
    4. Classic - Few punctuation characters and some diacritics removed.

    For more information on search parameters, please see https://www.mediawiki.org/wiki/API:Opensearch

#### Related Topics

This setting allows the user to establish the number of related topics they want to display in relation to the entity that was queried from Wikipedia.
