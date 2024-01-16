export interface FileServiceInterface {
  uploadFiles(files: any[], resource: string): Promise<any>;
  uploadFile(file: any, resource: string): Promise<any>;
  getFilesByIds(ids: string[]): Promise<any>;
  deleteFileByIds(ids: string[]): Promise<any>;
  handleSaveFiles({ resource, currentFiles, oldFiles, files }): Promise<any>;
}
