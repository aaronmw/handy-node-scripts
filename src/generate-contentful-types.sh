#!/bin/sh

source .env.local

cf-content-types-generator --v10 --spaceId $CONTENTFUL_SPACE_ID --token $CONTENTFUL_MANAGEMENT_ACCESS_TOKEN --out ./src/lib/contentfulTypes
