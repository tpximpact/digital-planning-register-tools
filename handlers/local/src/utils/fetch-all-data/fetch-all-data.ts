import path from 'path'
import fs from 'fs'

/**
 * Fetch all data from the json files locally
 * @param published
 * @param callback
 * @returns
 */
export const fetchAllData = <T>(
  published: boolean,
  callback?: (file: string) => boolean
): T[] => {
  try {
    const folder = published
      ? 'PostSubmissionPublishedApplication'
      : 'PostSubmissionApplication'
    const applicationsDir = path.join(__dirname, '../../data', folder)
    const entries = fs.readdirSync(applicationsDir, { withFileTypes: true })

    // Find all subdirectories
    const subdirs = entries.filter((e) => e.isDirectory()).map((e) => e.name)

    const allFiles: string[] = []
    for (const subdir of subdirs) {
      const subdirPath = path.join(applicationsDir, subdir)
      const files = fs
        .readdirSync(subdirPath)
        .filter(
          (file) => file.endsWith('.json') && (callback ? callback(file) : true)
        )
        .map((file) => path.join(subdirPath, file))
      allFiles.push(...files)
    }

    const results = allFiles.map((filePath) => {
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      return JSON.parse(fileContent)
    })

    return results
  } catch (error) {
    console.error('Error reading applications directory:', error)
    throw new Error('Failed to read applications directory')
  }
}
