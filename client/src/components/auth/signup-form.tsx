// Update your signup form to include Terms of Service acceptance
// This assumes you have a signup form component

import { useState } from 'react';
import { Button } from '@client/components/ui/button';
import { Input } from '@client/components/ui/input';
import { Label } from '@client/components/ui/label';
import { Checkbox } from '@client/components/ui/checkbox';

export function SignupForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    tosAccepted: false,
    privacyAccepted: false
  });
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.tosAccepted || !formData.privacyAccepted) {
      alert('You must accept the Terms of Service and Privacy Policy to continue.');
      return;
    }
    
    // Handle signup logic
    // ...
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          name="name"
          type="text"
          required
          value={formData.name}
          onChange={handleChange}
        />
      </div>
      
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          value={formData.password}
          onChange={handleChange}
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-start">
          <Checkbox 
            id="tos-consent"
            name="tosAccepted" 
            required
            checked={formData.tosAccepted}
            onCheckedChange={(checked) => 
              setFormData(prev => ({ ...prev, tosAccepted: checked === true }))
            }
            className="mt-1 mr-2"
          />
          <Label htmlFor="tos-consent" className="text-sm">
            I have read and agree to the <a href="/tos" target="_blank" rel="noopener noreferrer" className="text-primary">Terms of Service</a>
          </Label>
        </div>
        
        <div className="flex items-start">
          <Checkbox 
            id="privacy-consent"
            name="privacyAccepted" 
            required
            checked={formData.privacyAccepted}
            onCheckedChange={(checked) => 
              setFormData(prev => ({ ...prev, privacyAccepted: checked === true }))
            }
            className="mt-1 mr-2"
          />
          <Label htmlFor="privacy-consent" className="text-sm">
            I have read and agree to the <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary">Privacy Policy</a>
          </Label>
        </div>
      </div>
      
      <Button type="submit" className="w-full">
        Create Account
      </Button>
    </form>
  );
}