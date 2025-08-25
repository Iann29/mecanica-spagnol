import { createClient } from '@/lib/supabase/client'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { type FileError, type FileRejection, useDropzone } from 'react-dropzone'

const supabase = createClient()

interface FileWithPreview extends File {
  preview?: string
  errors: readonly FileError[]
}

type UseSupabaseUploadOptions = {
  /**
   * Name of bucket to upload files to in your Supabase project
   */
  bucketName: string
  /**
   * Folder to upload files to in the specified bucket within your Supabase project.
   *
   * Defaults to uploading files to the root of the bucket
   *
   * e.g If specified path is `test`, your file will be uploaded as `test/file_name`
   */
  path?: string
  /**
   * Allowed MIME types for each file upload (e.g `image/png`, `text/html`, etc). Wildcards are also supported (e.g `image/*`).
   *
   * Defaults to allowing uploading of all MIME types.
   */
  allowedMimeTypes?: string[]
  /**
   * Maximum upload size of each file allowed in bytes. (e.g 1000 bytes = 1 KB)
   */
  maxFileSize?: number
  /**
   * Maximum number of files allowed per upload.
   */
  maxFiles?: number
  /**
   * The number of seconds the asset is cached in the browser and in the Supabase CDN.
   *
   * This is set in the Cache-Control: max-age=<seconds> header. Defaults to 3600 seconds.
   */
  cacheControl?: number
  /**
   * When set to true, the file is overwritten if it exists.
   *
   * When set to false, an error is thrown if the object already exists. Defaults to `false`
   */
  upsert?: boolean
}

type UseSupabaseUploadReturn = ReturnType<typeof useSupabaseUpload>

const useSupabaseUpload = (options: UseSupabaseUploadOptions) => {
  const {
    bucketName,
    path,
    allowedMimeTypes = [],
    maxFileSize = Number.POSITIVE_INFINITY,
    maxFiles = 1,
    cacheControl = 3600,
    upsert = false,
  } = options

  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [errors, setErrors] = useState<{ name: string; message: string }[]>([])
  const [successes, setSuccesses] = useState<string[]>([])

  const isSuccess = useMemo(() => {
    if (errors.length === 0 && successes.length === 0) {
      return false
    }
    if (errors.length === 0 && successes.length === files.length) {
      return true
    }
    return false
  }, [errors.length, successes.length, files.length])

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      console.log('📥 [UPLOAD] onDrop chamado:', {
        acceptedFiles: acceptedFiles.length,
        rejections: fileRejections.length
      })
      const validFiles = acceptedFiles
        .filter((file) => !files.find((x) => x.name === file.name))
        .map((file) => {
          ;(file as FileWithPreview).preview = URL.createObjectURL(file)
          ;(file as FileWithPreview).errors = []
          return file as FileWithPreview
        })

      const invalidFiles = fileRejections.map(({ file, errors }) => {
        ;(file as FileWithPreview).preview = URL.createObjectURL(file)
        ;(file as FileWithPreview).errors = errors
        return file as FileWithPreview
      })

      const newFiles = [...files, ...validFiles, ...invalidFiles]
      setFiles(newFiles)
    },
    [files, setFiles]
  )

  const dropzoneProps = useDropzone({
    onDrop,
    noClick: true,
    accept: allowedMimeTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxSize: maxFileSize,
    maxFiles: maxFiles,
    multiple: maxFiles !== 1,
  })

  const onUpload = useCallback(async () => {
    console.log('🔵 [UPLOAD] Iniciando upload...')
    console.log('🔵 [UPLOAD] Bucket:', bucketName)
    console.log('🔵 [UPLOAD] Path:', path)
    console.log('🔵 [UPLOAD] Files to upload:', files.map(f => f.name))
    
    setLoading(true)

    // Verificar autenticação
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    console.log('🔵 [UPLOAD] Session check:', { 
      hasSession: !!session, 
      userId: session?.user?.id,
      sessionError 
    })
    
    if (!session) {
      console.error('🔴 [UPLOAD] Sem sessão ativa!')
      setLoading(false)
      return
    }

    // [Joshen] This is to support handling partial successes
    // If any files didn't upload for any reason, hitting "Upload" again will only upload the files that had errors
    const filesWithErrors = errors.map((x) => x.name)
    const filesToUpload =
      filesWithErrors.length > 0
        ? [
            ...files.filter((f) => filesWithErrors.includes(f.name)),
            ...files.filter((f) => !successes.includes(f.name)),
          ]
        : files

    console.log('🔵 [UPLOAD] Files que serão enviados:', filesToUpload.map(f => f.name))

    const responses = await Promise.all(
      filesToUpload.map(async (file) => {
        const uploadPath = !!path ? `${path}/${file.name}` : file.name
        console.log(`🔵 [UPLOAD] Enviando arquivo: ${file.name}`)
        console.log(`🔵 [UPLOAD] Path completo: ${uploadPath}`)
        console.log(`🔵 [UPLOAD] Tamanho do arquivo: ${file.size} bytes`)
        
        try {
          const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(uploadPath, file, {
              cacheControl: cacheControl.toString(),
              upsert,
            })
          
          console.log(`🔵 [UPLOAD] Resposta para ${file.name}:`, { data, error })
          
          if (error) {
            console.error(`🔴 [UPLOAD] Erro no upload de ${file.name}:`, error)
            return { name: file.name, message: error.message }
          } else {
            console.log(`✅ [UPLOAD] Sucesso no upload de ${file.name}`)
            return { name: file.name, message: undefined }
          }
        } catch (err) {
          console.error(`🔴 [UPLOAD] Erro inesperado no upload de ${file.name}:`, err)
          return { name: file.name, message: err instanceof Error ? err.message : 'Erro desconhecido' }
        }
      })
    )

    console.log('🔵 [UPLOAD] Todas as respostas:', responses)
    
    const responseErrors = responses.filter((x) => x.message !== undefined)
    console.log('🔵 [UPLOAD] Erros encontrados:', responseErrors)
    // if there were errors previously, this function tried to upload the files again so we should clear/overwrite the existing errors.
    setErrors(responseErrors)

    const responseSuccesses = responses.filter((x) => x.message === undefined)
    console.log('🔵 [UPLOAD] Sucessos:', responseSuccesses)
    
    const newSuccesses = Array.from(
      new Set([...successes, ...responseSuccesses.map((x) => x.name)])
    )
    setSuccesses(newSuccesses)

    console.log('🔵 [UPLOAD] Upload finalizado. Loading = false')
    setLoading(false)
  }, [files, path, bucketName, errors, successes, cacheControl, upsert])

  useEffect(() => {
    if (files.length === 0) {
      setErrors([])
    }

    // If the number of files doesn't exceed the maxFiles parameter, remove the error 'Too many files' from each file
    if (files.length <= maxFiles) {
      let changed = false
      const newFiles = files.map((file) => {
        if (file.errors.some((e) => e.code === 'too-many-files')) {
          file.errors = file.errors.filter((e) => e.code !== 'too-many-files')
          changed = true
        }
        return file
      })
      if (changed) {
        setFiles(newFiles)
      }
    }
  }, [files, setFiles, maxFiles])

  return {
    files,
    setFiles,
    successes,
    isSuccess,
    loading,
    errors,
    setErrors,
    onUpload,
    maxFileSize: maxFileSize,
    maxFiles: maxFiles,
    allowedMimeTypes,
    ...dropzoneProps,
  }
}

export { useSupabaseUpload, type UseSupabaseUploadOptions, type UseSupabaseUploadReturn }
