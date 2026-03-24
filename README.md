# Doomguy PR Complexity

A GitHub Action that scores pull requests by complexity and prefixes the title with a Doomguy emoji.

## Grading Scale

| Emoji | Complexity |
|-------|---------|
| 😊 | Trivial |
| 🙂 | Small |
| 😐 | Medium |
| 😠 | Large |
| 😡 | Huge |
| 💀 | Apocalyptic |

The score is calculated from the number of changed lines, files touched, and distinct file extensions.

## Usage

```yaml
name: PR Complexity
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  grade:
    runs-on: ubuntu-latest
    steps:
      - uses: your-org/doomguy-pr-complexity@main
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
```

## Development

```sh
npm install
npm test
npm run build
```

Linting and formatting use [Biome](https://biomejs.dev):

```sh
npm run lint       # check
npm run format     # check and fix
```
