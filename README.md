# Replace Env Vars Action

A GitHub Action that replaces `__TOKENS__` with environment variables in files. Drop-in replacement for `falnyr/replace-env-vars-action` with safe handling of special characters (`|`, `&`, `/`, `\`, `$`, etc.) in values.

## Usage

```yaml
- name: Replace tokens
  uses: sushidev-team/workflow-var-action@master
  with:
    filename: k8/deployment.yml
  env:
    PROJECT: ${{ vars.PROJECT }}
    APP_ENV: ${{ vars.APP_ENV }}
    DB_PASSWORD: ${{ secrets.DB_PASSWORD }}
    API_TOKEN: ${{ secrets.API_TOKEN }}
```

Given a file with placeholders:

```yaml
metadata:
  name: __PROJECT__-config-__APP_ENV__
data:
  DB_PASSWORD: __DB_PASSWORD__
  API_TOKEN: "__API_TOKEN__"
```

The action replaces all `__VAR__` patterns with the corresponding environment variable values:

```yaml
metadata:
  name: myapp-config-stage
data:
  DB_PASSWORD: p@ss|w0rd&special/chars
  API_TOKEN: "token|with|pipes"
```

## Inputs

| Name       | Required | Description                |
|------------|----------|----------------------------|
| `filename` | Yes      | Path to the file to process |

## How it works

- Scans the file for `__PLACEHOLDER__` patterns
- Replaces each placeholder with the matching environment variable
- Unmatched placeholders are left untouched
- Uses Node.js string replacement (no `sed`) so special characters in values are handled safely

## Migration from falnyr/replace-env-vars-action

Replace the `uses` line — everything else stays the same:

```diff
- uses: falnyr/replace-env-vars-action@master
+ uses: sushidev-team/workflow-var-action@master
```

## Development

```bash
npm install
npm test
```
