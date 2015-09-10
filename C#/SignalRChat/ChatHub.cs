using System;
using System.Collections.Generic;
using System.Web;
using Microsoft.AspNet.SignalR;
using Microsoft.Owin.Security;

namespace SignalRChat
{
    public class ChatHub : Hub
    {
       
        
        
        
        public void sendAllSounds(string name, string message)
        {
            Clients.All.broadcastMessage(name, message);
        }

        public void createSound()
        {
            string newId = SoundManager.Manager.addSound();
            Clients.All.broadcastCreateSound(newId);
        }

        public void modifyFrequency(string id, int f)
        {
            SoundManager.Manager.modifyFrequency(id, f);
            Clients.All.broadcastFrequencyChange(id, f);
        }

        public void updateClientSounds()
        {
            string json = SoundManager.Manager.convertInJSON();
            Clients.All.broadcastUpdateClientSounds(json);
        }
    }
}