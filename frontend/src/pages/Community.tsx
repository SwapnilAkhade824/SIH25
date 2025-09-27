import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; 
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Heart, 
  MessageCircle, 
  Share2, 
  Trophy, 
  Star,
  Upload,
  Filter,
  Search,
  Flame,
  TrendingUp,
  Crown
} from "lucide-react";

const posts = [
  {
    id: 1,
    user: {
      name: "Priya Sharma",
      avatar: "P",
      level: "Master",
      location: "Chennai, Tamil Nadu"
    },
    image: "/api/placeholder/300/300",
    title: "Festival Kolam for Pongal",
    description: "Traditional 13-dot kolam with rice flour and colored powders. Took 2 hours to complete!",
    category: "Traditional",
    likes: 142,
    comments: 23,
    shares: 8,
    timeAgo: "2 hours ago",
    featured: true
  },
  {
    id: 2,
    user: {
      name: "Rajesh Kumar",
      avatar: "R", 
      level: "Intermediate",
      location: "Bangalore, Karnataka"
    },
    image: "/api/placeholder/300/300",
    title: "Digital Kolam Creation",
    description: "Created this geometric pattern using KOLAM AI tools. Perfect symmetry achieved!",
    category: "Digital",
    likes: 89,
    comments: 15,
    shares: 12,
    timeAgo: "5 hours ago",
    featured: false
  },
  {
    id: 3,
    user: {
      name: "Meena Iyer",
      avatar: "M",
      level: "Expert", 
      location: "Madurai, Tamil Nadu"
    },
    image: "/api/placeholder/300/300",
    title: "Competition Entry - Lotus Mandala",
    description: "My entry for the Monthly Pattern Challenge. 25-dot complex design with temple architecture inspiration.",
    category: "Competition",
    likes: 267,
    comments: 45,
    shares: 31,
    timeAgo: "1 day ago",
    featured: true
  }
];

const challenges = [
  {
    title: "Monthly Pattern Challenge",
    description: "Create a kolam inspired by South Indian temples",
    prize: "₹5000 + Featured Profile",
    participants: 156,
    daysLeft: 12,
    type: "Competition"
  },
  {
    title: "Beginner Friendly Week",
    description: "Simple 5-dot patterns for newcomers",
    prize: "Recognition Badge",
    participants: 89,
    daysLeft: 5,
    type: "Learning"
  },
  {
    title: "Innovation Contest",
    description: "Modern twist on traditional designs",
    prize: "AI Analysis Tool Access",
    participants: 234,
    daysLeft: 20,
    type: "Innovation"
  }
];

const categories = ["All", "Traditional", "Digital", "Competition", "Learning", "Innovation"];

export default function Community() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Traditional": return "bg-primary/10 text-primary";
      case "Digital": return "bg-blue-100 text-blue-700";
      case "Competition": return "bg-purple-100 text-purple-700";
      case "Learning": return "bg-green-100 text-green-700";
      case "Innovation": return "bg-orange-100 text-orange-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "Master": return <Crown className="w-4 h-4 text-kolam-gold" />;
      case "Expert": return <Star className="w-4 h-4 text-purple-600" />;
      case "Intermediate": return <TrendingUp className="w-4 h-4 text-blue-600" />;
      default: return <Users className="w-4 h-4 text-green-600" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-traditional font-bold text-primary">
          Community Hub
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Connect with kolam enthusiasts worldwide. Share your creations, participate in challenges, 
          and celebrate the beauty of traditional South Indian art.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="analysis-card text-center">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold text-primary">15.2K</span>
            </div>
            <div className="text-sm text-muted-foreground">Active Members</div>
          </CardContent>
        </Card>
        <Card className="analysis-card text-center">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Upload className="w-5 h-5 text-accent" />
              <span className="text-2xl font-bold text-primary">3.4K</span>
            </div>
            <div className="text-sm text-muted-foreground">Designs Shared</div>
          </CardContent>
        </Card>
        <Card className="analysis-card text-center">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Trophy className="w-5 h-5 text-kolam-gold" />
              <span className="text-2xl font-bold text-primary">28</span>
            </div>
            <div className="text-sm text-muted-foreground">Active Contests</div>
          </CardContent>
        </Card>
        <Card className="analysis-card text-center">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Heart className="w-5 h-5 text-red-500" />
              <span className="text-2xl font-bold text-primary">89K</span>
            </div>
            <div className="text-sm text-muted-foreground">Total Likes</div>
          </CardContent>
        </Card>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? "bg-gradient-to-r from-primary to-accent text-primary-foreground" : ""}
            >
              {category}
            </Button>
          ))}
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
          <Button size="sm" variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
            <Upload className="w-4 h-4 mr-2" />
            Share Design
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-traditional font-bold text-primary flex items-center space-x-2">
            <Flame className="w-6 h-6 text-orange-500" />
            <span>Community Feed</span>
          </h2>

          {posts.map((post) => (
            <Card key={post.id} className="card-traditional">
              {post.featured && (
                <div className="bg-gradient-to-r from-kolam-gold to-accent p-2 rounded-t-2xl">
                  <p className="text-center text-white font-medium text-sm flex items-center justify-center space-x-2">
                    <Star className="w-4 h-4" />
                    <span>Featured Post</span>
                  </p>
                </div>
              )}
              
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-semibold">
                      {post.user.avatar}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-primary">{post.user.name}</h3>
                        {getLevelIcon(post.user.level)}
                      </div>
                      <p className="text-sm text-muted-foreground">{post.user.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getCategoryColor(post.category)}>
                      {post.category}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{post.timeAgo}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Image Placeholder */}
                <div className="aspect-square bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl border border-primary/10 flex items-center justify-center">
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-primary/40 mx-auto mb-2" />
                    <p className="text-primary/60 font-medium">{post.title}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg text-primary mb-2">{post.title}</h3>
                  <p className="text-muted-foreground">{post.description}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-primary/10">
                  <div className="flex items-center space-x-6">
                    <button className="flex items-center space-x-2 hover:text-red-500 transition-colors">
                      <Heart className="w-5 h-5" />
                      <span>{post.likes}</span>
                    </button>
                    <button className="flex items-center space-x-2 hover:text-blue-500 transition-colors">
                      <MessageCircle className="w-5 h-5" />
                      <span>{post.comments}</span>
                    </button>
                    <button className="flex items-center space-x-2 hover:text-green-500 transition-colors">
                      <Share2 className="w-5 h-5" />
                      <span>{post.shares}</span>
                    </button>
                  </div>
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Active Challenges */}
          <Card className="card-traditional">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-primary" />
                <span>Active Challenges</span>
              </CardTitle>
              <CardDescription>
                Participate and win exciting prizes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {challenges.map((challenge, index) => (
                <div key={index} className="p-3 border border-primary/20 rounded-lg hover:bg-primary/5 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-primary text-sm">{challenge.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {challenge.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {challenge.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{challenge.participants} participants</span>
                    <span>{challenge.daysLeft} days left</span>
                  </div>
                  <p className="text-sm font-medium text-kolam-gold mt-1">
                    Prize: {challenge.prize}
                  </p>
                </div>
              ))}
              <Button size="sm" className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground">
                View All Challenges
              </Button>
            </CardContent>
          </Card>

          {/* Top Contributors */}
          <Card className="card-traditional">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Crown className="w-5 h-5 text-kolam-gold" />
                <span>Top Contributors</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: "Lakshmi Devi", posts: 89, likes: "12.4K", level: "Master" },
                { name: "Arjun Pillai", posts: 67, likes: "9.8K", level: "Expert" },
                { name: "Kavya Menon", posts: 54, likes: "7.2K", level: "Expert" }
              ].map((user, index) => (
                <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-primary/5">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {user.name[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-sm">{user.name}</p>
                      {getLevelIcon(user.level)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {user.posts} posts • {user.likes} likes
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="card-traditional">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button size="sm" variant="outline" className="w-full justify-start">
                <Upload className="w-4 h-4 mr-2" />
                Share Your Design
              </Button>
              <Button size="sm" variant="outline" className="w-full justify-start">
                <Trophy className="w-4 h-4 mr-2" />
                Join Challenge
              </Button>
              <Button size="sm" variant="outline" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                Find Friends
              </Button>
              <Button size="sm" variant="outline" className="w-full justify-start">
                <MessageCircle className="w-4 h-4 mr-2" />
                Join Discussion
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}