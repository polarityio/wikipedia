# Polarity Wikipedia Integration

Polarity's Wikipedia integration gives users access to a short description of Wikipedia entries that match a tagged entity.

> Note that in order for the Wikipedia Integration to execute a query, an entity needs to be tagged in the Polarity Platform.  

## Wikipedia Settings

There are two main settings in the Wikipedia integration:

### Search Profile

Accepts a text string for one of the four support search profiles.  Valid values are:

#### fuzzy
Default search, supports typo correction.

#### strict
Few punctuation characters are removed but diacritics and stress marks are kept in search.

#### normal
Allows few punctuation characters, some diacritics and stop words are removed.

#### classic
Few punctuation characters and some diacritics removed.
   
### Related Topics

This setting allows the user to establish the number of related topics they want to display in relation to the entity that was queried in Wikipedia.

## Installation Instructions

You can install an integration by downloading the file from github, or by using git to clone the repo into your instance.

### Install from Zip/Tar File

1. Navigate to the [polarityio/wikipedia releases page](https://github.com/polarityio/wikipedia/releases).
2. Download the `tar.gz` file for the version of the integration you want to install (we typically recommend installing the latest version of the integration).
3. Upload the `tar.gz` file to your Polarity Server.
4. Move the `tar.gz` file to the Polarity Server integrations directory.

 ```bash
 mv <filename> /app/polarity-server/integrations
 ```

5. Once the file has been moved, navigate to the integrations folder:

 ```bash
 cd /app/polarity-server/integrations
 ```
  
6. Extract the tar file:

 ```bash
 tar -xzvf <filename>
 ```

6. Navigate into the extracted folder for the new integration:

 ```bash
cd <filename>
```

7. Install the integration's dependencies:

 ```bash
npm install
```

8. Ensure the integration directory is owned by the `polarityd` user
 
 ```bash
chown -R polarityd:polarityd /app/polarity-server/integrations/wikipedia
```

9. Restart your Polarity-Server

 ```bash
service polarityd restart
```

10. Navigate to the integrations page in Polarity-Web to configure the integration.

### Installing via GIT Clone

1. Navigate to the integrations folder:

 ```bash
cd /app/polarity-server/integrations
```

2. Clone a specific version of the wikipedia repo using git:

 ```bash
git clone --branch <version> https://github.com/polarityio/wikipedia.git
```

3. Change into the integration directory

 ```bash
cd wikipedia
```

4. Use `npm` to install the integration's dependencies

 ```bash
npm install
```

5.  Ensure the integration directory is owned by the `polarityd` user

 ```bash
chown -R polarityd:polarityd /app/polarity-server/integrations/wikipedia
```

6. Restart your Polarity-Server

 ```bash
service polarityd restart
```

7. Navigate to the integrations page in Polarity-Web to configure the integration

## Polarity

Polarity is a memory-augmentation platform that improves and accelerates analyst decision making.  For more information about the Polarity platform please see: 

https://polarity.io/
