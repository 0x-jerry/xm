import * as semver from 'semver/mod.ts'

export function getLatestCompatibleVersion(
  originVersion: string,
  versions: string[],
) {
  let latestVersion = originVersion

  if (!originVersion) {
    latestVersion = versions[0]
  } else {
    for (const version of versions) {
      if (
        semver.satisfies(version, '^' + originVersion) &&
        semver.gt(version, latestVersion)
      ) {
        latestVersion = version
      }
    }
  }

  return latestVersion
}
