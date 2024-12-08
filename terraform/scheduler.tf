resource "google_cloud_scheduler_job" "scheduler" {
  name        = "task-scheduler"
  description = "Trigger Cloud Function periodically"
  schedule  = var.scheduler_cron
  time_zone = var.scheduler_time_zone

  http_target {
    uri          = google_cloudfunctions_function.task_function.https_trigger_url
    http_method  = "POST"
    oidc_token {
      service_account_email = google_cloudfunctions_function.task_function.service_account_email
    }
  }
}
