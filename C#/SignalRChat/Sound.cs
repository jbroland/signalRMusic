using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SignalRChat
{
    public class Sound
    {
        private string _id;
        private string _format;
        private string _datastring;
        public int frequency;

        public Sound(int frequency)
        {
            this.frequency = frequency;
        }

        public Sound()
        {
        
        }

    }
}