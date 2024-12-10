resource "google_service_account" "bucket_creator_sa" {
  account_id   = "bucket-creator"
  display_name = "Bucket Creator Service Account"
}

resource "google_cloudfunctions_function" "task_function" {
  depends_on = [
    google_project_service.cloud_functions_api,
    google_project_service.artifact_registry_api,
    google_project_service.cloud_build_api,
    google_project_service.cloud_scheduler_api,
    google_storage_bucket_object.task_script
  ]

  name        = var.function_name
  description = var.function_description
  runtime     = var.function_runtime

  entry_point = "runTask"

  source_archive_bucket = google_storage_bucket.task_bucket.name
  source_archive_object = google_storage_bucket_object.task_script.name

  trigger_http          = true
  available_memory_mb = var.function_memory_mb
  service_account_email = google_service_account.bucket_creator_sa.email

  environment_variables = {
    TASK_SCRIPT_URL = "gs://${google_storage_bucket.task_bucket.name}/${google_storage_bucket_object.task_script.name}"
  }
}
