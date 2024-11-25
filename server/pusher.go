package main

import "github.com/pusher/pusher-http-go/v5"

func NewPusherClient(appId, key, secret, cluster string, secure bool) *pusher.Client {
	return &pusher.Client{
		AppID:   appId,
		Key:     key,
		Secret:  secret,
		Cluster: cluster,
		Secure:  secure,
	}
}
