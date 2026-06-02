// Package events defines NATS subjects and event contracts shared between
// services, plus a thin publisher/subscriber wrapper.
package events

import "time"

// Subjects published across the platform.
const (
	SubjectUserRegistered        = "user.registered"
	SubjectDoctorCreated         = "doctor.created"
	SubjectDoctorVerified        = "doctor.verified"
	SubjectBookingCreated        = "booking.created"
	SubjectBookingCancelled      = "booking.cancelled"
	SubjectConsultationStarted   = "consultation.started"
	SubjectConsultationCompleted = "consultation.completed"
	SubjectNotificationTriggered = "notification.triggered"
)

// UserRegistered is emitted by auth-service after a successful signup.
type UserRegistered struct {
	UserID     string    `json:"userId"`
	Role       string    `json:"role"`
	Email      string    `json:"email"`
	FirstName  string    `json:"firstName"`
	OccurredAt time.Time `json:"occurredAt"`
}

// DoctorCreated is emitted when a doctor profile is created.
type DoctorCreated struct {
	DoctorID       string    `json:"doctorId"`
	UserID         string    `json:"userId"`
	Specialization string    `json:"specialization"`
	OccurredAt     time.Time `json:"occurredAt"`
}

// DoctorVerified is emitted when an admin decides a verification application.
type DoctorVerified struct {
	DoctorID   string    `json:"doctorId"`
	Status     string    `json:"status"`
	ReviewedBy string    `json:"reviewedBy"`
	OccurredAt time.Time `json:"occurredAt"`
}

// BookingCreated is emitted when a booking is created.
type BookingCreated struct {
	BookingID   string    `json:"bookingId"`
	PatientID   string    `json:"patientId"`
	DoctorID    string    `json:"doctorId"`
	ScheduledAt time.Time `json:"scheduledAt"`
	OccurredAt  time.Time `json:"occurredAt"`
}

// BookingCancelled is emitted when a booking is cancelled.
type BookingCancelled struct {
	BookingID   string    `json:"bookingId"`
	CancelledBy string    `json:"cancelledBy"`
	Reason      string    `json:"reason"`
	OccurredAt  time.Time `json:"occurredAt"`
}

// NotificationTriggered asks notification-service to create a notification.
type NotificationTriggered struct {
	UserID     string            `json:"userId"`
	Type       string            `json:"type"`
	Title      string            `json:"title"`
	Body       string            `json:"body"`
	Data       map[string]string `json:"data,omitempty"`
	OccurredAt time.Time         `json:"occurredAt"`
}
