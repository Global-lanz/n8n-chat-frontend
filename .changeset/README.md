# Changesets

This directory contains changeset files used to track changes for versioning and changelog generation.

## How to create a changeset

```bash
npx changeset
```

Choose the bump type (patch / minor / major) and write a human-readable description of the change.

## How it works

1. Create a changeset file per PR (`npx changeset`)
2. When merged to main, the `version-and-release` workflow creates a "Version Packages" PR
3. When that PR is merged, the version is bumped in `package.json`, `CHANGELOG.md` is updated, and the Docker image is published

## Skip changeset

If the PR does not affect users (e.g. CI fixes, docs, refactors), add the `skip-changeset` label to the PR instead.
