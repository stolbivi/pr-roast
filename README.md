# roast-bot

> A GitHub App built with [Probot](https://github.com/probot/probot) that Get a most \&quot;honest\&quot; PR review. Don&#x27;t take it personal.

## Setup

```sh
# Install dependencies
npm install

# Run the bot
npm start
```

## Docker

```sh
# 1. Build container
docker build -t roast-bot .

# 2. Start container
docker run -e APP_ID=<app-id> -e PRIVATE_KEY=<pem-value> roast-bot
```

## Contributing

If you have suggestions for how roast-bot could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[ISC](LICENSE) © 2026 stolbivi
