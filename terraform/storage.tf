resource "google_storage_bucket" "task_bucket" {
  name                        = "${var.project_id}-task-bucket"
  location                    = var.region
  uniform_bucket_level_access = true
}

resource "google_storage_bucket_object" "task_script" {
  name   = "function-${timestamp()}.zip"
  bucket = google_storage_bucket.task_bucket.name
  source = "${path.module}/../dist/function-source.zip"
}
