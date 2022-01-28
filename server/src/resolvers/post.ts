import { MyContext } from "src/types";
import { Arg, Ctx, Field, InputType, Int, Mutation, Query, Resolver } from "type-graphql";
import { Post } from "../entities/Post";

@InputType()
class PostInput{
    @Field()
    title: string
    @Field()
    text: string
}

@Resolver()
export class PostResolver{
    @Query(() => [Post])
    async posts(): Promise<Post[]>{        
        return Post.find();        
    }

    @Query(() => Post,{nullable:true})
    post(@Arg("id", () => Int) id: number): Promise<Post | undefined>{        
        return Post.findOne(id);        
    }

    @Mutation(() => Post)
    async createPost(
        @Arg("input") input: PostInput, 
        @Ctx(){req}: MyContext): Promise<Post>{
        
        if(!req.session.UserId){
            throw new Error("Not authenticated");
        }

        return Post.create({
            ...input,
            creatorId: req.session.UserId
        }).save();
    }

    @Mutation(() => Post, {nullable:true})
    async updatePost(
        @Arg("id") id: number,
        @Arg("title") title: string): Promise<Post | null>{
            const post = await Post.findOne(id)
            if (!post){
                return null;
            }
            if(typeof title !== "undefined"){                
                await Post.update({id},{title})
            }            
            return post;
    }

    @Mutation(() => Boolean)
    async deletePost(
        @Arg("id") id: number): Promise<boolean>{
            try{
                await Post.delete(id);
            }              
            catch{
                return false;
            }
            return true;
    }

}