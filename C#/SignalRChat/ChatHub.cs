using System;
using System.Web;
using Microsoft.AspNet.SignalR;
namespace SignalRChat
{
    public class ChatHub : Hub
    {
        public void Send(string name, string message)
        {
            Clients.All.broadcastMessage(name, message);
        }

        public void createSound(string id)
        {
            Clients.All.broadcastCreateSound(id);
        }

        public void modifyFrequency(string id, int f)
        {
            Clients.All.broadcastFrequencyChange(id, f);
        }
    }
}