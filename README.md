# Freelance Tool

A simple tool I wrote to assist me in freelancing. Add the amount of hours you worked on each day for a given client and easily create and download invoices for any client/month.
Currently only creates invoices suited for Germany-based freelancers working for Germany-based clients.

## Disclaimer

This is not an official tool and there is no oversight to ensure compliance with German tax laws. I wrote this tool for personal use. As such it doesn't have the same rigorous testing as commercial/official solutions applied. Use at your own risk and only in conjunction with additional backups of your data. Double-check the invoices it creates for errors. Ideally run on a secured (virtual) private network as an additional layer of security.

## Usage

Create `.env.local` file based on `.env.local.template` and set all variables. This is only needed for development and cypress testing. Variables need to be set on `docker run` for deployment, see below.

### Build

```bash
docker build . -t freelance-tool
```

### Run

```bash
docker run -it -p [application-port]:3000 --env SESSION_SECRET=[session-secret] --env PGHOST=[postgres-host-ip] --env PGUSER=[postgres-user] --env PGPASSWORD=[postgres-pw] --env PGDATABASE=core --env PGPORT=6500 --env LOG_DIRECTORY=/app/logs freelance-tool
```

If you want to test without an SSL certificate set `--env NODE_ENV=development` as well, otherwise the app will force an https connection.

## TODOs

- Automated docker image building/publishing
- 2-Factor authentication with TOTP
- Automated invoice creation (idea is to send them to your email account automatically, so you can just forward them after checking for errors)
- Polish/streamline GUI
- Code cleanup

## Known issues
