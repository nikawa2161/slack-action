# Service AccountへのStorage Admin付与
resource "google_project_iam_member" "bucket_creator_storage_admin" {
  project = var.project_id
  role    = "roles/storage.admin"
  member  = "serviceAccount:${google_service_account.bucket_creator_sa.email}"
}

# Cloud Functionsに対するInvokerロール付与
resource "google_cloudfunctions_function_iam_member" "task_function_invoker" {
  project        = var.project_id
  region         = var.region
  cloud_function = google_cloudfunctions_function.task_function.name
  role           = "roles/cloudfunctions.invoker"
  member         = "serviceAccount:${google_cloudfunctions_function.task_function.service_account_email}"
}

# ユーザーへの必要ロール付与
resource "google_project_iam_member" "add_storage_admin" {
  project = var.project_id
  role    = "roles/storage.admin"
  member  = "user:${var.current_user_email}"
}

resource "google_project_iam_member" "add_service_account_admin" {
  project = var.project_id
  role    = "roles/iam.serviceAccountAdmin"
  member  = "user:${var.current_user_email}"
}

resource "google_project_iam_member" "add_project_iam_admin" {
  project = var.project_id
  role    = "roles/resourcemanager.projectIamAdmin"
  member  = "user:${var.current_user_email}"
}

resource "google_project_iam_member" "add_service_account_key_admin" {
  project = var.project_id
  role    = "roles/iam.serviceAccountKeyAdmin"
  member  = "user:${var.current_user_email}"
}
