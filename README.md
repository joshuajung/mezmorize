# mezmorize

This little tool imports OVMS log files into Mezmo, to make them easier to analyze.

## Requirements

- A current version of Node, ideally with corepack enabled
- A Mezmo account with an ingestion key

## Installation

1. Run `yarn install`

## Usage

1. Place your log files from one day into the `working` subdirectory
1. Run `MEZMO_KEY=youringestionkey yarn local`
1. Open the link supplied at the end of the script.

## Remarks

Mezmo only allows logs from the last 24 hrs. Therefore, this script sets all log dates to the current calendar day (yes, this is rather hacky).
