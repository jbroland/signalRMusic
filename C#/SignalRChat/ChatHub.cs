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

        public void createSound(int id)
        {
            Clients.All.broadcastCreateSound(id);
        }

        public void modifyFrequency(int id, int f)
        {
            Clients.All.broadcastFrequencyChange(id);
        }
    }
}