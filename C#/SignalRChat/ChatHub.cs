using System;
using System.Collections.Generic;
using System.Web;
using Microsoft.AspNet.SignalR;
namespace SignalRChat
{
    public class ChatHub : Hub
    {
        private Dictionary<string,Sound> soundDico=new Dictionary<string, Sound>();
        
        
        public void Send(string name, string message)
        {
            Clients.All.broadcastMessage(name, message);
        }

        public void createSound()
        {
            var id = "sound" + soundDico.Count;
            soundDico.Add(id,new Sound());
            Clients.All.broadcastCreateSound(id);
        }

        public void modifyFrequency(string id, int f)
        {
            Clients.All.broadcastFrequencyChange(id, f);
        }
    }
}