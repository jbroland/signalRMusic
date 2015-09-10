using System;
using System.Collections.Generic;
using System.Web;
using Microsoft.AspNet.SignalR;
using Microsoft.Owin.Security;

namespace SignalRChat
{
    public class ChatHub : Hub
    {
       
        
        
        
        public void Send(string name, string message)
        {
            Clients.All.broadcastMessage(name, message);
        }

        public void createSound()
        {
            SoundManager.Manager.addSong();
            Clients.All.broadcastCreateSound();
        }

        public void modifyFrequency(string id, int f)
        {
            Clients.All.broadcastFrequencyChange(id, f);
        }
    }
}