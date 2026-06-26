# Terraform configuration for Vave HRM infrastructure

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.25"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.5"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
  zone    = var.zone
}

#----------------------------
# VPC & Subnet
#----------------------------
resource "google_compute_network" "vpc" {
  name                    = "vave-hrm-vpc"
  auto_create_subnetworks = false
  routing_mode            = "REGIONAL"
}

resource "google_compute_subnetwork" "subnet" {
  name          = "vave-hrm-subnet"
  ip_cidr_range = "10.0.0.0/16"
  region        = var.region
  network       = google_compute_network.vpc.id
}

#----------------------------
# GKE Cluster
#----------------------------
resource "google_container_cluster" "gke" {
  name               = "vave-hrm-cluster"
  location           = var.zone
  remove_default_node_pool = true
  initial_node_count = 1
  network            = google_compute_network.vpc.id
  subnetwork         = google_compute_subnetwork.subnet.id
  ip_allocation_policy {}

  addons_config {
    http_load_balancing {
      disabled = false
    }
    horizontal_pod_autoscaling {
      disabled = false
    }
    network_policy {
      disabled = false
    }
  }
}

resource "google_container_node_pool" "primary_nodes" {
  name       = "primary-pool"
  location   = var.zone
  cluster    = google_container_cluster.gke.name
  node_count = var.gke_node_count

  node_config {
    machine_type = var.gke_machine_type
    oauth_scopes = [
      "https://www.googleapis.com/auth/cloud-platform"
    ]
    labels = {
      environment = "prod"
    }
    tags = ["vave-hrm"]
    metadata = {
      disable-legacy-endpoints = "true"
    }
  }
}

#----------------------------
# Cloud SQL (PostgreSQL)
#----------------------------
resource "google_sql_database_instance" "postgres" {
  name             = "vave-hrm-sql"
  database_version = "POSTGRES_15"
  region           = var.region
  settings {
    tier = var.sql_tier
    ip_configuration {
      ipv4_enabled    = false
      private_network = google_compute_network.vpc.id
    }
    backup_configuration {
      enabled = true
    }
    maintenance_window {
      day  = 7
      hour = 3
    }
  }
}

resource "google_sql_user" "admin" {
  name     = "postgres"
  instance = google_sql_database_instance.postgres.name
  password = random_password.db_admin.result
}

resource "random_password" "db_admin" {
  length  = 16
  special = true
}

resource "google_sql_database" "vave_hrm" {
  name     = "vave_hrm"
  instance = google_sql_database_instance.postgres.name
  charset  = "UTF8"
  collation = "en_US.UTF8"
}

#----------------------------
# Cloud Storage bucket for assets
#----------------------------
resource "google_storage_bucket" "assets" {
  name          = "vave-hrm-assets-${var.project_id}"
  location      = var.region
  uniform_bucket_level_access = true
  force_destroy = true
}

#----------------------------
# Artifact Registry for Docker images
#----------------------------
resource "google_artifact_registry_repository" "docker_repo" {
  provider = google
  location = var.region
  repository_id = "vave-hrm-docker"
  format   = "DOCKER"
  description = "Docker images for Vave HRM backend and frontend"
}

#----------------------------
# Service Account for workloads
#----------------------------
resource "google_service_account" "workload_sa" {
  account_id   = "vave-hrm-workload"
  display_name = "Vave HRM workload service account"
}

resource "google_project_iam_member" "sa_artifact_access" {
  project = var.project_id
  role    = "roles/artifactregistry.writer"
  member  = "serviceAccount:${google_service_account.workload_sa.email}"
}

resource "google_project_iam_member" "sa_sql_access" {
  project = var.project_id
  role    = "roles/cloudsql.client"
  member  = "serviceAccount:${google_service_account.workload_sa.email}"
}

#----------------------------
# Outputs
#----------------------------
output "gke_cluster_name" {
  value = google_container_cluster.gke.name
}
output "postgres_instance_connection_name" {
  value = google_sql_database_instance.postgres.connection_name
}
output "docker_repository_url" {
  value = google_artifact_registry_repository.docker_repo.repository_url
}
