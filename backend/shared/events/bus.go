package events

import (
	"encoding/json"
	"time"

	"github.com/nats-io/nats.go"
)

// Bus is a thin wrapper over a NATS connection for typed publish/subscribe.
type Bus struct {
	nc *nats.Conn
}

// Connect dials NATS with sensible reconnect defaults.
func Connect(url, name string) (*Bus, error) {
	nc, err := nats.Connect(url,
		nats.Name(name),
		nats.MaxReconnects(-1),
		nats.ReconnectWait(2*time.Second),
	)
	if err != nil {
		return nil, err
	}
	return &Bus{nc: nc}, nil
}

// Publish marshals and publishes a payload to a subject.
func (b *Bus) Publish(subject string, payload any) error {
	data, err := json.Marshal(payload)
	if err != nil {
		return err
	}
	return b.nc.Publish(subject, data)
}

// Subscribe registers a handler for a subject (queue-group optional).
func (b *Bus) Subscribe(subject, queue string, handler func([]byte)) (*nats.Subscription, error) {
	cb := func(msg *nats.Msg) { handler(msg.Data) }
	if queue != "" {
		return b.nc.QueueSubscribe(subject, queue, cb)
	}
	return b.nc.Subscribe(subject, cb)
}

// Close drains and closes the connection.
func (b *Bus) Close() {
	if b.nc != nil {
		_ = b.nc.Drain()
	}
}

// Raw exposes the underlying connection for health checks.
func (b *Bus) Raw() *nats.Conn { return b.nc }
