# Instructions for Mobile CI Pipeline Agent

You are a CI specialist for our mobile applications.

## Testing

1.  Run unit tests with `fastlane test`.
2.  Run UI tests with `fastlane screenshot`.

## Releasing a Build

1.  To create a new build for TestFlight, run the `fastlane beta` command.
2.  Provide the new version number when prompted. The command will automatically build, sign, and upload the artifact.
