# Generic OGP Server

## Example

Let's say, you want to display a OGP image generated dynamicaly depending on the user's UUID.
You want to write a `og:image` like this.

```
<!-- https://www.example.com/results/{{ $user->uuid }} -->

<html prefix="og: https://ogp.me/ns#">
    <head>
        <title>Quiz Page - My Result</title>
        <meta property="og:title" content="{{ $user->name }}'s Result" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.example.com/results/{{ $user->uuid }}" />
        <meta property="og:image" content="https://www.example.com/projects/<HARD_CODE_PROJECT_KEY>/images/{{ $user->uuid }}/ogp.jpg" />
        ...
    </head>
...
</html>

```

This code sameple proposes the implementation of how to dynamically generate OGP images depending on a recived request.

## Sample

```
<html prefix="og: https://ogp.me/ns#">
    <head>
        <title>Quiz Page - My Result</title>
        <meta property="og:title" content="{{ $user->name }}'s Result" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.example.com/results/{{ $user->uuid }}" />
        <meta property="og:image" content="https://us-central1-generic-ogp-server.cloudfunctions.net/onRequest?projectKey=sample_campaign&uniqueKey=2nMfx7aakVmDgSX5eQVO" />
        ...
    </head>
...
</html>
```

### Sample og:image URLs

- [https://us-central1-generic-ogp-server.cloudfunctions.net/onRequest?projectKey=sample_campaign&uniqueKey=2nMfx7aakVmDgSX5eQVO](https://us-central1-generic-ogp-server.cloudfunctions.net/onRequest?projectKey=sample_campaign&uniqueKey=2nMfx7aakVmDgSX5eQVO)
- [https://us-central1-generic-ogp-server.cloudfunctions.net/onRequest?projectKey=sample_campaign&uniqueKey=8Fa2okzpt7BLJn8SnKmc](https://us-central1-generic-ogp-server.cloudfunctions.net/onRequest?projectKey=sample_campaign&uniqueKey=8Fa2okzpt7BLJn8SnKmc)

## Concept

### Save Record Request (Unqiue Web Page → firebase)

- Front-end is expected to send a request of `projectKey`, `uniqueKey`, `data` to a certain request url.
  - `projectKey` specifies which project to refer to.
    - This must be unique in the entire service.
  - `uniqueKey` specifies a unique user.
    - This must be unique in the specified project.

### Get OGP Request (front-end (i.e. Twitter, Facebook...) → firebase)

- Front-end is expected to send a request of `projectKey`, `uniqueKey`, `data` to a certain request url.
  - `projectKey` specifies which project to refer to.
    - This must be unique in the entire service.
  - `uniqueKey` specifies a unique user.
    - This must be unique in the specified project.

### OGP Generation and Response

- Recieves Get OGP Request on a URL with UUID.
- Selects the specified user's data based on the UUID acquired from requested URL.
- Generates image data with that user's data.
- Sends a response of image data
