variable "project_id" {
  description = "GCP project ID"
  type        = string
}

variable "region" {
  description = "GCP region"
  type        = string
  default     = "us-central1"
}

variable "zone" {
  description = "GCP zone"
  type        = string
  default     = "us-central1-a"
}

variable "gke_node_count" {
  description = "Number of nodes in the primary node pool"
  type        = number
  default     = 3
}

variable "gke_machine_type" {
  description = "Machine type for GKE nodes"
  type        = string
  default     = "e2-medium"
}

variable "sql_tier" {
  description = "Cloud SQL tier (e.g., db-custom-2-7680)"
  type        = string
  default     = "db-f1-micro"
}

variable "gcp_service_account_key" {
  description = "Base64‑encoded service account JSON key for CI/CD"
  type        = string
  sensitive   = true
}

variable "gcp_project_id" {
  description = "Project ID for gcloud commands (duplicate of project_id for convenience)"
  type        = string
}
