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

        public void modifyType(string id, string type)
        {
            SoundManager.Manager.modifyType(id, type);
            Clients.All.broadcastTypeChange(id, type);
        }

        public void updateClientSounds()
        {
            string json = SoundManager.Manager.convertInJSON();
            Clients.Caller.castUpdateClientSounds(json);
        }

        public void resetSounds()
        {
            SoundManager.Manager.resetSounds();
            Clients.All.broadcastResetSounds();
        }

        public void deleteSound(string id)
        {
            SoundManager.Manager.deleteSound(id);
            Clients.All.broadcastDeleteSound();
        }

        public void sendAudioFile(string name, string buffer, string type)
        {
            Clients.All.createAudioElement("audio0", name, buffer, type);
        }

        public void sendAudioFile()
        {
            Clients.All.createAudioElement("audio0");
        }

       
    }
}